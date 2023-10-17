class PaymentsController < ApplicationController
  def index
    @user = current_user
    @payments = @user.payments
  end

  def invoice
    @payment = Payment.find(params[:id])
  end
end
