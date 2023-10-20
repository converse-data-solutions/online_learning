class EntrollmentMailer < ApplicationMailer
  def new_entrollment_notification(entrollment)
    @entrollment = entrollment
    mail(to: 'smartaravindhan001@gmail.com', subject: 'New User Enrollment')
  end
end
