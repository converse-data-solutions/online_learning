class Admin::PaymentsController < ApplicationController
  def index
    @payments = Payment.get_payments(params)
  end

  def new
    @payment = Payment.new
  end

  def create
    @payment = Payment.new(payment_params)
    if @payment.save
      user_course = UserCourse.find_by(id: params[:payment][:user_course_id])
      user_course.update(next_payment_date: params[:next_payment_date]) if user_course.present?
      redirect_to admin_payments_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  def user_course
    @user = User.find_by(id: params[:user_id])
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

  def generate_invoice_pdf
    @payment = Payment.find_by(id: params[:id])

    respond_to do |format|
      format.html
      format.pdf do
        pdf_data = render_to_string(pdf: 'Invoice', template: 'admin/payments/invoice', formats: [:html], layout: 'pdf')

        PaymentMailer.send_invoice_with_pdf(@payment, pdf_data).deliver_now

        render pdf: 'Invoice', template: 'admin/payments/invoice', formats: [:html], layout: 'pdf'
      end
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
    PaymentMailer.payment_due_notification(@user_course).deliver_now
    redirect_to collections_admin_payments_path
  end

  def user_invoice
    @user = User.find_by(params[:user_id])
    @courses = @user.courses
    respond_to(&:turbo_stream)
  end

  def user_collection
    @user = User.find_by(params[:user_id])
    @courses = @user.courses
    respond_to(&:turbo_stream)
  end

  private

  def payment_params
    params.require(:payment).permit(:user_id, :user_course_id, :paid_at, :paid_amount, :next_payment_date)
  end
end
