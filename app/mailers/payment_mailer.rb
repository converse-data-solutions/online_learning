class PaymentMailer < ApplicationMailer
  def payment_due_notification(user_course)
    @user_course = user_course
    mail(to: @user_course.user.email, subject: 'Payment Due')
  end
end
