class Admin::PaymentsController < ApplicationController

  def index
    @payments = Payment.get_payments(params)
  end

  def new
    @payment = Payment.new
  end

  def create # rubocop:disable Metrics/AbcSize
    @payment = Payment.new(payment_params)
    respond_to do |format|
      if @payment.save
        user_course = UserCourse.find_by(id: params[:payment][:user_course_id])
        user_course.update(next_payment_date: params[:next_payment_date]) if user_course.present?
        format.html { render :new }
        format.turbo_stream
      else
        format.html { render :new }
        format.turbo_stream { render turbo_stream: turbo_stream.append('payment-filter-container', partial: 'shared/failed', locals: { message: 'Payment creation failed.', type: 'notice' }) }
      end
    end
  end

  def user_course
    @user = User.find_by(id: params[:user_id])
    respond_to do |format|
      if @user
        @courses = @user.courses
        format.turbo_stream
      else
        format.turbo_stream { render turbo_stream: turbo_stream.append('payment-filter-container', partial: 'shared/failed', locals: { message: 'User not found .', type: 'notice' }) }
      end
    end
  end

  def balance_amount
    @user = User.find_by(id: params[:user_id])
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
    @user = User.find_by(id: params[:user_id])
    respond_to do |format|
      if @user
        @courses = @user.courses
        format.turbo_stream
      else
        format.turbo_stream { render turbo_stream: turbo_stream.append('payment-table', partial: 'shared/failed', locals: { message: 'User not found .', type: 'notice' }) }
      end
    end
  end

  def user_collection
    @user = User.find_by(id: params[:user_id])
    respond_to do |format|
      if @user
        @courses = @user.courses
        format.turbo_stream
      else
        format.turbo_stream { render turbo_stream: turbo_stream.append('collection-table', partial: 'shared/failed', locals: { message: 'User not found .', type: 'notice' }) }
      end
    end
  end

  private

  def payment_params
    params.require(:payment).permit(:user_id, :user_course_id, :paid_at, :paid_amount, :next_payment_date)
  end
end
