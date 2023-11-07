class StripeController < ApplicationController
  skip_before_action :verify_authenticity_token, only: %i[webhook]
  def purchase_success
    session = Stripe::Checkout::Session.retrieve(params[:session_id])
    return unless session.payment_status == 'paid'

    course_id = session.metadata.course_id
    course = Course.find(course_id)
    user = current_user
    Entrollment.find_or_create_by(user:, course:) do |purchase|
      purchase.status = 'approved'
      purchase.save!
      redirect_to courses_path
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
    rescue JSON::ParserError, Stripe::SignatureVerificationError => e
      head 400
      return
    end
    case event.type
    when 'checkout.session.completed'
      session = event.data.object
      if session.client_reference_id.present?
        subscription = Stripe::Subscription.retrieve(session.subscription)
        user = User.find_by(email: session.customer_email)
        puts session.inspect
        subscription_record = Subscription.find_or_create_by(
          user:
        )
        subscription_record.update!(
          status: 'active',
          paid_until: Time.at(subscription.current_period_end),
          next_invoice_on: Time.at(subscription.current_period_end),
          stripe_subscription_ref: subscription.id,
          stripe_customer_ref: subscription.customer
        )
        SubscriptionDetail.create(
          user:,
          subscription: subscription_record,
          stripe_subscription_id: subscription.id,
          amount: subscription.items.data.first.price.unit_amount,
          paid_at: Time.now,
          start_date: Time.at(subscription.current_period_start),
          end_date: Time.at(subscription.current_period_end)
        )
      end
    when 'customer.subscription.updated'
      stripe_subscription = event.data.object
      subscription = Subscription.find_by(stripe_subscription_ref: stripe_subscription.id)
      if subscription
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
        SubscriptionDetail.create(
          user: subscription.user,
          subscription:,
          stripe_subscription_id: stripe_subscription.id,
          amount: stripe_subscription.items.data.first.price.unit_amount,
          paid_at: Time.now,
          start_date: Time.at(stripe_subscription.current_period_start),
          end_date: Time.at(stripe_subscription.current_period_end)
        )
      end
    when 'customer.subscription.created'
      stripe_subscription = event.data.object
      subscription = Subscription.find_by(stripe_subscription_ref: stripe_subscription.id)
      if subscription
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
        subscription.update!(
          status: 'canceled',
          paid_until: Time.at(stripe_subscription.current_period_end),
          next_invoice_on: Time.at(stripe_subscription.current_period_end)
        )
      end

    else
      puts "Unhandled event type: #{event.type}"
    end

    head :ok
  end
end
