# frozen_string_literal: true

# This is an Admin Section controller
class Admin::SectionsController < ApplicationController
  # before_action :course_assignment, only: %i[new create edit update show]
  before_action :section_assignment, only: %i[show edit update]
  require 'will_paginate/array'

  def index
    # @courses = Course.find(params[:course_id])
    # @sections = @courses.sections
    # @sections = Section.all
    @sections = []
    Section.all.includes(:course).each do |section|
      @sections.push(section)
    end
    @sections = @sections.paginate(page: params[:page], per_page: 5)
  end

  def new
    @section = Sections.new
  end

  def create
    @section = Section.new(section_params)
    @section.save
  end

  def edit; end

  def update
    @section.update(section_params)
  end

  def show; end

  def destroy
    @section = Section.find(params[:id])
    @section.destroy
    redirect_to admin_courses_path
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
