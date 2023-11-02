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
    byebug
    subscription_type = params[:monthly] ? 'monthly' : 'yearly'
    byebug
    if session.payment_status == 'paid'
    # Create a Subscription record when the subscription payment is successfully completed
    subscription = Subscription.create(
      user: current_user,
      status: 'active',
      subscription_type: subscription_type, # Customize based on your logic
      amount_paid: session.amount_total, # Example: Set the actual subscription amount
      paid_at: Time.now,
      next_due: Time.now + 1.month, # Example: Next due date is one month from now
      stripe_subscription_id: session.subscription # Assuming Stripe stores subscription ID in the session
    )

    redirect_to courses_path
  end
  end
end
