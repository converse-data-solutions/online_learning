class Admin::PaymentsController < ApplicationController
  def index
    @payments = Payment.includes(:user_course).all
  end

  def new
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

  def balance_amount
    @user = User.find_by(id: params[:user_id])
    @balance = @user.user_courses.find_by(course_id: params[:course_id])
    respond_to(&:turbo_stream)
  end

  def invoice
    @payment = Payment.find_by(id: params[:id])
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: 'Invoice', template: 'admin/payments/invoice', formats: [:html], layout: 'pdf'
      end
    end
  end

  private

  def payment_params
    params.require(:payment).permit(:user_id, :user_course_id, :paid_at, :paid_amount)
  end
end
