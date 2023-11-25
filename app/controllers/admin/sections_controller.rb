# frozen_string_literal: true

# This is an Admin Section controller
class Admin::SectionsController < ApplicationController
  # before_action :course_assignment, only: %i[new create edit update show]
  before_action :section_assignment, only: %i[show edit update]
  def index
    # @courses = Course.find(params[:course_id])
    # @sections = @courses.sections
    @sections = Section.all
  end

  def new
    @section = Sections.new
  end

  def create
    @section = Section.new(section_params)
    if @section.save
      redirect_to admin_course_sections_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    return unless @section.update(section_params)

    redirect_to admin_sections_path
  end

  def show; end

  def destroy
    @section = Section.find(params[:id])
    @section.destroy
    redirect_to admin_sections_path
  end

  private

  def course_assignment
    @course = Course.find(params[:course_id])
  end

  def section_assignment
    @section = Section.find(params[:id])
  end

  def section_params
    params.require(:section).permit(:title, :description, :course_id)
  end
end
