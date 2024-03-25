class Admin::SchedulesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_schedule, only: %i[show edit update destroy]
  def index
    @schedules = Schedule.all
    respond_to do |format|
      format.html { render :index }
      format.turbo_stream
      format.json { render json: @schedules }
    end
  end

  def new
    @schedule = Schedule.new
  end

  def create
    @schedule = Schedule.new(schedule_params)
    respond_to do |format|
      if @schedule.save
        @schedules = Schedule.all
        format.turbo_stream
        format.json { render :show, status: :created, location: admin_schedule_url(@schedule) }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace('schedule-admin-form', partial: 'admin/schedules/form', locals: { schedule: @schedule }),
            turbo_stream.append('schedule-table', partial: 'shared/failed', locals: { message: 'Schedule creation failed.', type: 'notice' })
          ]
        end
      end
    end
  end

  def edit
    render layout: false
  end

  def update
    respond_to do |format|
      if @schedule.update(schedule_params)
        @schedules = Schedule.all
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_schedule_url(@schedule) }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace('schedule-admin-form', partial: 'admin/schedules/form', locals: { schedule: @schedule }),
            turbo_stream.append('schedule-table', partial: 'shared/failed', locals: { message: 'Schedule update failed.', type: 'notice' })
          ]
        end
      end
    end
  end

  def destroy
    respond_to do |format|
      if @schedule&.destroy
        @schedules = Schedule.all
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace('schedule-table', partial: 'admin/schedules/table', locals: { schedules: @schedules }),
            turbo_stream.append('schedule-table', partial: 'shared/flash', locals: { message: 'Schedule was successfully destroyed.', type: 'notice' })
          ]
        end
        format.json { render :show, status: :ok, location: admin_schedule_url(@schedule) }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append('schedule-table', partial: 'shared/failed', locals: { message: 'Schedule deletion failed.', type: 'notice' })
          ]
        end
      end
    end
  end

  private

  def set_schedule
    @schedule = Schedule.find(params[:id])
  end

  def schedule_params
    params.require(:schedule).permit(:batch_id, :schedule_date, :schedule_timings, :user_id, :course_id)
  end
end
