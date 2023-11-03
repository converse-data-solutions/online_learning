class StripeController < ApplicationController
  def purchase_success
     session = Stripe::Checkout::Session.retrieve(params[:session_id])
    if session.payment_status == 'paid'
      course_id = session.metadata.course_id
      course = Course.find(course_id)
      Entrollment.find_or_create_by(user: current_user, course: course) do |purchase|
        purchase.status = 'approved'
        purchase.save!
        redirect_to courses_path
      end
    end
  end

  def subscription_success
    session = Stripe::Checkout::Session.retrieve(params[:session_id])
    
    subscription_type = params[:monthly] ? 'monthly' : 'yearly'
    
    if session.payment_status == 'paid'
    subscription = Subscription.create(
      user: current_user,
      status: 'active',
      subscription_type: subscription_type, 
      amount_paid: session.amount_total,
      paid_at: Time.now,
      next_due: Time.now + 1.month, 
      stripe_subscription_id: session.subscription
    )

    redirect_to courses_path
  end
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
         status 400
         return
     rescue Stripe::SignatureVerificationError => e
         # Invalid signature
         status 400
         return
     end
 
     # Handle the event
     case event.type
     when 'checkout.session.completed'
         session = event.data.object
         if session.client_reference_id.present?
           subscription = Subscription.find_by(session.client_reference_id)
           subscription.update!(stripe_customer_ref: session.customer, stripe_subscription_id: session.subscription)
         end
     when 'customer.subscription.updated'
       stripe_subscription = event.data.object
       subscription = Subscription.find_by(stripe_subscription_ref: stripe_subscription.id)
       subscription.update(status: subscription.status, paid_until: Time.at(subscription.current_period_end))
     when 'customer.subscription.created'
         stripe_subscription = event.data.object
         subscription = Subscription.find_by(stripe_subscription_ref: stripe_subscription.id)
         subscription.update(status: subscription.status, paid_until: Time.at(subscription.current_period_end))
     when 'customer.subscription.deleted'
       stripe_subscription = event.data.object
       subscription = Subscription.find_by(stripe_subscription_ref: stripe_subscription.id)
       subscription.update(status: subscription.status, paid_until: Time.at(subscription.current_period_end))
     else
         puts "Unhandled event type: #{event.type}"
     end
 
     status 200
 
   end

end
