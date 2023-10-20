class PaymentsController < ApplicationController
  layout 'pdf'
  def index
    @user = current_user
    @payments = @user.payments
  end

  def invoice
    @payment = Payment.find(params[:id])
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: 'Invoice', template: 'payments/invoice', formats: [:html], layout: 'pdf'
      end
    end
  end
end
