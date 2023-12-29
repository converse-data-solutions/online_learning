# frozen_string_literal: true

# This is an Admin Course controller
class Admin::CoursesController < ApplicationController # rubocop:disable Style/ClassAndModuleChildren
  # before_action :authenticate_admin!
  require 'will_paginate/array'
  def index # rubocop:disable Metrics/MethodLength,Metrics/AbcSize
    @courses = []
    Course.all.each do |course|
      @courses.push(course)
    end
    @courses = Course.search_by_course_name(params[:search]).paginate(page: params[:page], per_page: 5)
    @sections = Course.last.sections
    if params[:section_id].present?
      @section = Section.find_by(id: params[:id])
      @lessons = @section.lessons
    else
      @lessons = Lesson.all
    end
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @courses }
      format.turbo_stream
    end
  end

  def new
    @course = Course.new
    @show_edit_form = true
  end

  def create # rubocop:disable Metrics/MethodLength
    @course = Course.new(course_params)
    respond_to do |format|
      if @course.save
        @show_edit_form = false
        format.html
        format.turbo_stream
        format.json { render :show, status: :created, location: @course }
      else
        format.html
        format.turbo_stream { render turbo_stream: turbo_stream.replace('admin-course-form', partial: 'admin/courses/form', locals: { course: @course }) }
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
    @course = Course.find_by(id: params[:id])
  end

  def update # rubocop:disable Metrics/AbcSize
    @course = Course.find_by(id: params[:id])
    respond_to do |format|
      if @course.update(course_params)
        format.turbo_stream { redirect_to admin_courses_path, notice: 'Course updated successfully' }
        format.json { render :show, status: :ok, location: admin_course_url(@course) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.update('edit-course-popup', partial: 'admin/courses/edit', locals: { course: @course }) }
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy # rubocop:disable Metrics/AbcSize
    @course = Course.find_by(id: params[:id])
    respond_to do |format|
      if @course&.destroy
        format.turbo_stream { redirect_to admin_courses_path, notice: 'Course deleted successfully' }
        format.json { render :show, status: :ok, location: admin_course_url(@course) }
      else
        format.turbo_stream { redirect_to admin_courses_path, notice: 'Course destroy failed' }
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def course_params
    params.require(:course).permit(:id, :course_name, :description)
  end
end
