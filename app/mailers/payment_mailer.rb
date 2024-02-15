class PaymentMailer < ApplicationMailer
  def payment_due_notification(user_course)
    @user_course = user_course
    mail(to: @user_course.user.email, subject: 'Payment Due')
  end

  def send_invoice_with_pdf(payment, pdf_data)
    @payment = payment

    attachments['invoice.pdf'] = pdf_data

    mail(to: @payment.user_course.user.email, subject: 'Invoice')
  end
end
