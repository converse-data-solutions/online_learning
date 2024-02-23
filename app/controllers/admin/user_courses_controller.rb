class Admin::UserCoursesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user_course, only: %i[edit update destroy show]

  def index
    @user_courses = UserCourse.get_user_courses(params)
    respond_to do |format|
      format.html { render :index }
      format.turbo_stream
      format.json { render json: @user_courses }
    end
  end

  def new
    @user_course = UserCourse.new
  end

  def create
    @user_course = UserCourse.new(admin_params)
    respond_to do |format|
      if @user_course.save
        @user_courses = UserCourse.get_user_courses(params)
        format.turbo_stream
        format.json { render :create }
      else
        render_invalid_user(format)
      end
    end
  end

  def edit
    render layout: false
    return if @user_course

    flash[:alert] = 'User course not found.'
    redirect_to admin_user_courses_path
  end

  def update # rubocop:disable Metrics/MethodLength
    respond_to do |format|
      if @user_course.update(admin_params)
        @user_courses = UserCourse.get_user_courses(params)
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_user_course_url(@user_course) }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update('edit-user-course-popup', partial: 'admin/user_courses/edit', locals: { user_course: @user_course })
          ]
        end
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy # rubocop:disable Metrics/MethodLength,Metrics/AbcSize
    respond_to do |format|
      if @user_course.destroy
        @user_courses = UserCourse.get_user_courses(params)
        format.turbo_stream { render_destroy_success }
        format.json { render :show }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append('user-course-table', partial: 'shared/flash', locals: { message: 'User course deletion failed.', type: 'notice' }), # rubocop:disable Layout/LineLength
            turbo_stream.update('render-pagination', partial: 'admin/user_courses/pagination', locals: { user_courses: @user_courses })
          ]
        end
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def receive_course_amount
    @course = Course.find_by(id: params[:course_id])
  end

  private

  def render_invalid_user(format)
    format.turbo_stream do
      render turbo_stream: [
        turbo_stream.replace('user-course-admin-form', partial: 'admin/user_courses/form', locals: { user_course: @user_course })
      ]
    end
    format.json { render json: @user.errors, status: :unprocessable_entity }
  end

  def render_destroy_success
    render turbo_stream: [
      turbo_stream.append('user-course-table', partial: 'shared/flash', locals: { message: 'User course was successfully destroyed.', type: 'notice' }),
      turbo_stream.update('user-course-table', partial: 'admin/user_courses/table', locals: { user_courses: @user_courses })
    ]
  end

  def set_user_course
    @user_course = UserCourse.find_by(id: params[:id])
  end

  def admin_params
    params.require(:user_course).permit(:user_id, :course_id, :next_payment_date, :enrolled_at, :course_amount)
  end
end
