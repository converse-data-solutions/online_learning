class Admin::CoursesController < ApplicationController
    # before_action :authenticate_admin!
    before_action :check_admin_role

    def index
        @courses = Course.all
    end

    def new
        @course = Course.new
    end

    def create
        @course = Course.new(course_params)
            if @course.save
            redirect_to admin_courses_path
        else
            render :new
        end
    end

    def edit
        @course = Course.find(params[:id])
    end

    def update
        @course = Course.find(params[:id])
        if @course.update(course_params)
            redirect_to admin_courses_path
        else
            render :edit
        end
    end

    def destroy
        @course = Course.find(params[:id])
        if @course.destroy
        redirect_to admin_courses_path
        end
    end

    def show
        @course = Course.find(params[:id])
    end

    private

    def course_params
        params.require(:course).permit(:id, :course_name, :description, :user_id)
    end
end
