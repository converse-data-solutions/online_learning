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
    redirect_to courses_path
  end

end
