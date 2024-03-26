class Admin::TrainerAttendancesController < ApplicationController # rubocop:disable Metrics/ClassLength
  before_action :authenticate_user!
  before_action :set_attendance, only: %i[edit update destroy toggle_status]

  def index
    @trainer_attendances = TrainerAttendance.get_trainers_attendances(params)
    respond_to do |format|
      format.json { render json: @trainer_attendances }
      format.html { render :index }
      format.turbo_stream
    end
  end

  def new
    @trainer_attendance = TrainerAttendance.new
  end

  def create
    @trainer_attendance = TrainerAttendance.new(trainer_attendance_params)
    respond_to do |format|
      if @trainer_attendance.save
        @trainer_attendances = TrainerAttendance.get_trainers_attendances(params)
        format.turbo_stream
        format.json { render :create }
      else
        render_invalid_attendance(format)
      end
    end
  end

  def edit
    render layout: false
    return if @trainer_attendance

    flash[:alert] = 'Attendance not found.'
    redirect_to admin_trainer_attendances_path
  end

  def update # rubocop:disable Metrics/MethodLength
    respond_to do |format|
      if @trainer_attendance.update(trainer_attendance_params)
        @trainer_attendances = TrainerAttendance.get_trainers_attendances(params)
        format.turbo_stream
        format.json { render :update }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update('edit-attendance-popup', partial: 'admin/trainer_attendances/edit', locals: { trainer_attendance: @trainer_attendance }),
            turbo_stream.append('trainer_attendance-table', partial: 'shared/failed', locals: { message: 'Attendance update failed.', type: 'notice' })
          ]
        end
      end
    end
  end

  def toggle_status # rubocop:disable Metrics/MethodLength
    @status = params[:status]
    if @trainer_attendance.update(status: @status)
      @trainer_attendances = TrainerAttendance.get_trainers_attendances(params)
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append("trainer_attendance-table", partial: "shared/flash", locals: { message: 'Attendance updated successfully.', type: 'notice' }), # rubocop:disable Style/StringLiterals
            turbo_stream.update("trainer_attendance-table", partial: "admin/trainer_attendances/table", locals: { trainer_attendances: @trainer_attendances }) # rubocop:disable Style/StringLiterals
          ]
        end
      end
    else
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.append("trainer_attendance-table", partial: "shared/failed", locals: { message: 'Attendance update failed.', type: 'notice' }), # rubocop:disable Style/StringLiterals
        ]
      end
    end
  end

  def destroy # rubocop:disable Metrics/MethodLength
    respond_to do |format|
      if @trainer_attendance.destroy
        @trainer_attendances = TrainerAttendance.get_trainers_attendances(params)
        format.turbo_stream { render_destroy_success }
        format.json { render :show }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append('trainer_attendance-table', partial: 'shared/failed', locals: { message: 'Attendance deletion failed.', type: 'notice' }),
            turbo_stream.update("render-pagination", partial: "admin/trainer_attendances/paginate", locals: { trainer_attendances: @trainer_attendances }) # rubocop:disable Style/StringLiterals
          ]
        end
        format.json { render json: @trainer_attendance.errors, status: :unprocessable_entity }
      end
    end
  end

  def find_users_course
    @trainer_courses = TrainerCourse.where(user_id: params[:user_id])
    respond_to do |format|
      if @trainer_courses
        format.turbo_stream
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append('trainer_attendance-table', partial: 'shared/failed', locals: { message: 'Course not found.', type: 'notice' })
          ]
        end
      end
    end
  end

  private

  def render_invalid_attendance(format)
    format.turbo_stream do
      render turbo_stream: [
        turbo_stream.replace('admin-attendance-form', partial: 'admin/trainer_attendances/form', locals: { trainer_attendance: @trainer_attendance }),
        turbo_stream.append('trainer_attendance-table', partial: 'shared/failed', locals: { message: 'Attendance creation failed.', type: 'notice' }),
      ]
    end
    format.json { render json: @trainer_attendance.errors, status: :unprocessable_entity }
  end

  def render_destroy_success
    render turbo_stream: [
      turbo_stream.append("trainer_attendance-table", partial: "shared/flash", locals: { message: 'Attendance was successfully deleted.', type: 'notice' }), # rubocop:disable Style/StringLiterals,Layout/LineLength
      turbo_stream.update('trainer_attendance-table', partial: 'admin/trainer_attendances/table', locals: { trainer_attendances: @trainer_attendances })
    ]
  end

  def set_attendance
    @trainer_attendance = TrainerAttendance.find_by(id: params[:id])
  end

  def trainer_attendance_params
    params.require(:trainer_attendance).permit(:trainer_course_id, :attendance_date, :class_timing, :status, :batch_id)
  end

end
