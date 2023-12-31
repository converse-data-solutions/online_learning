# frozen_string_literal: true

# This is an Entrollment controller
class EntrollmentsController < ApplicationController
  def new
    @entrollment = Entrollment.new
    @course = Course.find(params[:course_id])
    @entrollment.course_id = @course.id
    @entrollment.user_id = current_user.id
  end

  def create
    @entrollment = Entrollment.new(entrollment_params)
    if @entrollment.save
      EntrollmentMailer.new_entrollment_notification(@entrollment).deliver_now

      flash[:notice] = 'Entrollment request submitted.'
      redirect_to courses_path
    else
      flash[:error] = 'Entrollment request not submitted.'
      render :new
    end
  end

  private

  def entrollment_params
    params.require(:entrollment).permit(:course_id, :user_id)
  end
end
