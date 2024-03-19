# frozen_string_literal: true
class Admin::PaymentsController < ApplicationController
  before_action :set_user, only: %i[user_course balance_amount user_invoice user_collection]

  def index
    @payments = Payment.get_payments(params)
  end

  def new
    @payment = Payment.new
  end

  def create
    @payment = Payment.new(payment_params)
    respond_to do |format|
      if @payment.save
        update_user_course_next_payment_date
        format.html { render :new }
        format.turbo_stream
      else
        format.html { render :new }
        format.turbo_stream { render turbo_stream: turbo_stream.append('payment-filter-container', partial: 'shared/failed', locals: { message: 'Payment creation failed.', type: 'notice' }) }
      end
    end
  end

  def user_course
    handle_user_presence
  end

  def balance_amount
    respond_to do |format|
      if @user
        @balance = @user.user_courses.find_by(course_id: params[:course_id])
        format.turbo_stream
      else
        format.turbo_stream { render turbo_stream: turbo_stream.append('payment-filter-container', partial: 'shared/failed', locals: { message: 'User not found .', type: 'notice' }) }
      end
    end
  end

  def invoice
    @payment = Payment.find_by(id: params[:id])
    if @payment
      respond_to do |format|
        format.html
        format.pdf do
          render pdf: 'Invoice', template: 'admin/payments/invoice', formats: [:html], layout: 'pdf'
        end
      end
    else
      flash[:alert] = 'Payment not found.'
    end
  end

  def generate_invoice_pdf
    @payment = Payment.find_by(id: params[:id])
    if @payment
      pdf_data = render_to_string(pdf: 'Invoice', template: 'admin/payments/invoice', formats: [:html], layout: 'pdf')
      if PaymentMailer.send_invoice_with_pdf(@payment, pdf_data).deliver_now
        flash[:notice] = 'Invoice sent successfully.'
      else
        flash[:alert] = "Failed to send invoice."
      end
    else
        flash[:alert] = "Payment not found."
    end
  end

  def collections
    @user_courses = UserCourse.get_collections(params)
    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  def send_due_email
    @user_course = UserCourse.find_by(id: params[:id])
    if @user_course
      if PaymentMailer.payment_due_notification(@user_course).deliver_now
        flash[:notice] = "Email sent successfully."
        redirect_to collections_admin_payments_path
      else
        flash[:alert] = "Failed to send email."
        redirect_to collections_admin_payments_path
      end
    else
      flash[:alert] = "User course not found."
    end
  end

  def user_invoice
    handle_user_presence
  end

  def user_collection
    handle_user_presence
  end

  private

  def set_user
    @user = User.find_by(id: params[:user_id])
  end

  def update_user_course_next_payment_date
    user_course = UserCourse.find_by(id: @payment.user_course_id)
    if user_course.present?
      if user_course.update(next_payment_date: params[:next_payment_date])
        flash[:notice] = "Next payment date updated successfully."
      else
        flash[:alert] = "Failed to update next payment date."
      end
    else
      flash[:alert] = "User course not found."
    end
  end
  
  def handle_user_presence
    if @user
      @courses = @user.courses
      respond_to { |format| format.turbo_stream }
    else
      render_user_not_found
    end
  end

  def render_user_not_found
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.append(
          container_selector,
          partial: 'shared/failed',
          locals: { message: 'User not found.', type: 'notice' }
        )
      end
    end
  end

  def container_selector
    case action_name
    when 'user_course'
      'payment-filter-container'
    when 'user_invoice'
      'payment-table'
    when 'user_collection'
      'collection-table'
    else
      'default-container'
    end
  end

  def payment_params
    params.require(:payment).permit(:user_id, :user_course_id, :paid_at, :paid_amount, :next_payment_date)
  end
end
