class Admin::AttendanceDetailsController < ApplicationController # rubocop:disable Style/FrozenStringLiteralComment,Style/ClassAndModuleChildren
  before_action :authenticate_user!
  before_action :set_attendance, only: %i[edit update destroy toggle_status]

  def index
    @attendance_details = Attendance.get_attendances(params)
    respond_to do |format|
      format.json { render json: @attendance_details }
      format.html { render :index }
      format.turbo_stream
    end
  end

  def new
    @attendance_detail = Attendance.new
  end

  def create
    @attendance_detail = Attendance.new(attendance_params)
    respond_to do |format|
      if @attendance_detail.save
        @attendance_details = Attendance.get_attendances(params)
        format.turbo_stream
        format.json { render :create }
      else
        render_invalid_attendance(format)
      end
    end
  end

  def edit
    render layout: false
    return if @attendance_detail

    flash[:alert] = 'Attendance not found.'
    redirect_to admin_attendance_details_path
  end

  def update # rubocop:disable Metrics/MethodLength
    respond_to do |format|
      if @attendance_detail.update(attendance_params)
        @attendance_details = Attendance.get_attendances(params)
        format.turbo_stream
        format.json { render :update }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update('edit-attendance-popup', partial: 'admin/attendance_details/edit', locals: { attendance_detail: @attendance_detail }) # rubocop:disable Layout/LineLength
          ]
        end
      end
    end
  end

  def toggle_status # rubocop:disable Metrics/MethodLength
    @status = params[:status]
    if @attendance_detail.update(status: @status)
      @attendance_details = Attendance.get_attendances(params)
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append("attendance-table", partial: "shared/flash", locals: { message: 'Attendance updated successfully.', type: 'notice' }), # rubocop:disable Style/StringLiterals
            turbo_stream.update("attendance-table", partial: "admin/attendance_details/table", locals: { attendance_details: @attendance_details }) # rubocop:disable Style/StringLiterals
          ]
        end
      end
    else
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.append("attendance-table", partial: "shared/failed", locals: { message: 'Attendance update failed.', type: 'notice' }), # rubocop:disable Style/StringLiterals
        ]
      end
    end
  end

  def destroy # rubocop:disable Metrics/MethodLength,Metrics/AbcSize
    respond_to do |format|
      if @attendance_detail.destroy
        @attendance_details = Attendance.get_attendances(params)
        format.turbo_stream { render_destroy_success }
        format.json { render :show }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append('attendance-table', partial: 'shared/failed', locals: { message: 'Attendance deletion failed.', type: 'notice' }),
            turbo_stream.update("render-pagination", partial: "admin/attendance_details/paginate", locals: { attendance_details: @attendance_details }) # rubocop:disable Style/StringLiterals
          ]
        end
        format.json { render json: @attendance_detail.errors, status: :unprocessable_entity }
      end
    end
  end

  def find_users_course
    @user_courses = UserCourse.where(user_id: params[:user_id])
    puts "User: #{@user}"
    puts "Course: #{@course}"
    respond_to(&:turbo_stream)
  end

  private

  def render_invalid_attendance(format)
    format.turbo_stream do
      render turbo_stream: [
        turbo_stream.replace('admin-attendance-form', partial: 'admin/attendance_details/form', locals: { attendance_detail: @attendance_detail })
      ]
    end
    format.json { render json: @attendance_detail.errors, status: :unprocessable_entity }
  end

  def render_destroy_success
    render turbo_stream: [
      turbo_stream.append("attendance-table", partial: "shared/flash", locals: { message: 'Attendance was successfully deleted.', type: 'notice' }), # rubocop:disable Style/StringLiterals,Layout/LineLength
      turbo_stream.update('attendance-table', partial: 'admin/attendance_details/table', locals: { attendance_details: @attendance_details })
    ]
  end

  def set_attendance
    @attendance_detail = Attendance.find_by(id: params[:id])
  end

  def attendance_params
    params.require(:attendance).permit(:class_date, :status, :user_course_id)
  end
end
