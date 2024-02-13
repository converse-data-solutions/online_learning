class Admin::PaymentsController < ApplicationController
  def index
    @payments = Payment.all
  end

  def new
    @course = Course.find_by(id: params[:course_id])
    @payment = Payment.new
  end

  def create
    @payment = Payment.new(payment_params)
    if @payment.save
      redirect_to admin_payments_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  def user_course
    @user = User.find(params[:user_id])
    @courses = @user.courses
    respond_to(&:turbo_stream)
  end

  private

  def payment_params
    params.require(:payment).permit(:user_id, :entrollment_id, :amount, :paid_at)
  end
end
