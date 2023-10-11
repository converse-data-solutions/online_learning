# frozen_string_literal: true

# This is an Admin Section controller
class Admin::SectionsController < ApplicationController
  # before_action :authenticate_admin!
  def index
    @courses = Course.find(params[:course_id])
    @sections = @courses.sections
  end

  def new
    @course = Course.find(params[:course_id])
    @section = @course.sections.new
  end

  def create
    @course = Course.find(params[:course_id])
    @section = @course.sections.create(section_params)
    if @section.save
      redirect_to admin_course_sections_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @course = Course.find(params[:course_id])
    @section = @course.sections.find(params[:id])
  end

  def update
    @course = Course.find(params[:course_id])
    @section = @course.sections.find(params[:id])
    if @section.update(section_params)
      redirect_to admin_course_sections_path
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def show
    @course = Course.find(params[:course_id])
    @section = @course.sections.find(params[:id])
  end

  def destroy
    @section = Section.find(params[:id])
    @section.destroy
    redirect_to admin_course_sections_path
  end

  private

  def section_params
    params.require(:section).permit(:title, :description, :course_id)
  end
end
