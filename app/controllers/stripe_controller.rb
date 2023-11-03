class StripeController < ApplicationController
skip_before_action :verify_authenticity_token, only: :webhook
  def purchase_success
     session = Stripe::Checkout::Session.retrieve(params[:session_id])
    if session.payment_status == 'paid'
      course_id = session.metadata.course_id
      course = Course.find(course_id)
      Entrollment.find_or_create_by(user: current_user, course: course) do |purchase|
        purchase.status = 'approved'
        purchase.save!
        purchase.stripe_ref = session.payment_intent
        redirect_to courses_path
      end
    end
  end

  def subscription_success
    redirect_to courses_path
  end

  def webhook
    endpoint_secret = 'whsec_pTGtblz2rm1Bwzzd6q10BIYie3VEAcmX'
  
    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    event = nil
  
    begin
      event = Stripe::Webhook.construct_event(
        payload, sig_header, endpoint_secret
      )
    rescue JSON::ParserError => e
      # Invalid payload
      head 400
      return
    rescue Stripe::SignatureVerificationError => e
      # Invalid signature
      head 400
      return
    end
  
    # Handle the event
    case event.type
    when 'checkout.session.completed'
      session = event.data.object
      if session.client_reference_id.present?
        # Retrieve the associated subscription
        subscription = Stripe::Subscription.retrieve(session.subscription)
        user = User.find_by(email: session.customer_email)  # You need to adapt this based on your user lookup logic
        subscription_record = Subscription.find_or_create_by(
          stripe_customer_ref: subscription.customer,
          stripe_subscription_ref: subscription.id,
          user: user  # Associate the user with the subscription
        )
        subscription_record.update!(
          status: 'active',
          paid_until: Time.at(subscription.current_period_end),
          next_invoice_on: Time.at(subscription.current_period_end)
        )
      end
    
    when 'customer.subscription.updated'
      stripe_subscription = event.data.object
      subscription = Subscription.find_by(stripe_subscription_ref: stripe_subscription.id)
      if subscription
        # Update status, paid_until, and next_invoice_on based on subscription status
        if stripe_subscription.status == 'active'
          subscription.update!(
            status: 'active',
            paid_until: Time.at(stripe_subscription.current_period_end),
            next_invoice_on: Time.at(stripe_subscription.current_period_end)
          )
        else
          subscription.update!(
            status: 'canceled',
            paid_until: nil,
            next_invoice_on: nil
          )
        end
      end
    when 'customer.subscription.created'
      stripe_subscription = event.data.object
      subscription = Subscription.find_by(stripe_subscription_ref: stripe_subscription.id)
      if subscription
        # Update status, paid_until, and next_invoice_on based on subscription status
        if stripe_subscription.status == 'active'
          subscription.update!(
            status: 'active',
            paid_until: Time.at(stripe_subscription.current_period_end),
            next_invoice_on: Time.at(stripe_subscription.current_period_end)
          )
        else
          subscription.update!(
            status: 'canceled',
            paid_until: nil,
            next_invoice_on: nil
          )
        end
      end
    when 'customer.subscription.deleted'
      stripe_subscription = event.data.object
      subscription = Subscription.find_by(stripe_subscription_ref: stripe_subscription.id)
      if subscription
        # Update status, paid_until, and next_invoice_on based on subscription status
        subscription.update!(
          status: 'canceled',
          paid_until: nil,
          next_invoice_on: nil
        )
      end
    else
      puts "Unhandled event type: #{event.type}"
    end
  
    head :ok
  end
  

end
