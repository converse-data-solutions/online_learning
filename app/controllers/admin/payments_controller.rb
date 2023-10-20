class Admin::PaymentsController < ApplicationController
  def index
    @payments = Payment.all
  end

  def new
    @users = User.all
    @entrollments = Entrollment.all
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

  def edit
    @payment = Payment.find(params[:id])
  end

  def update
    @payment = Payment.find(params[:id])
    if @payment.update(payment_params)
      redirect_to admin_payments_path
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @payment = Payment.find(params[:id])
    @payment.destroy
    redirect_to admin_payments_path
  end

  def show
    @payment = Payment.find(params[:id])
  end

  private

  def payment_params
    params.require(:payment).permit(:user_id, :entrollment_id, :amount, :paid_at)
  end
end
