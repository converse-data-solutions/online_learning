# frozen_string_literal: true

# This is an Admin Course controller
class Admin::CoursesController < ApplicationController # rubocop:disable Style/ClassAndModuleChildren
  before_action :authenticate_user!
  before_action :set_course, only: %i[edit update destroy]

  require 'will_paginate/array'
  def index
    @courses = Course.get_courses(params)
    if params[:section_id].present?
      @section = Section.find_by(id: params[:id])
      @lessons = @section.lessons
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

  def create # rubocop:disable Metrics/MethodLength,Metrics/AbcSize
    params[:course][:course_type] = params[:course][:course_type].to_i
    @course = Course.new(course_params)
    respond_to do |format|
      if @course.save
        @courses = Course.get_courses(params)
        @last_created_course_id = @course.id
        @show_edit_form = false
        format.html
        format.turbo_stream
        format.json { render :show, status: :created, location: @course }
      else
        format.html
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace('admin-course-form', partial: 'admin/courses/form', locals: { course: @course }),
            turbo_stream.append('course-table', partial: 'shared/failed', locals: { message: 'Course creation failed.', type: 'notice' })
          ]
        end
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
    render layout: false
  end

  def update # rubocop:disable Metrics/AbcSize,Metrics/MethodLength
    params[:course][:course_type] = params[:course][:course_type].to_i
    respond_to do |format|
      if @course.update(course_params)
        @courses = Course.get_courses(params)
        format.turbo_stream
        format.json { render :show, status: :ok, location: admin_course_url(@course) }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace('edit-course-popup', partial: 'admin/courses/edit', locals: { course: @course }),
            turbo_stream.replace('admin-course-step-edit-form', partial: 'admin/courses/stepedit', locals: { course: @course }),
            turbo_stream.append('course-table', partial: 'shared/failed', locals: { message: 'Course creation failed.', type: 'notice' })
          ]
        end
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy # rubocop:disable Metrics/AbcSize,Metrics/MethodLength
    respond_to do |format|
      if @course&.destroy
        @courses = Course.get_courses(params)
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update('course-table', partial: 'admin/courses/table', locals: { courses: @courses }),
            turbo_stream.append('course-table', partial: 'shared/flash', locals: { message: 'Course was successfully destroyed.', type: 'notice' }),
          ]
        end
        format.json { render :show, status: :ok, location: admin_course_url(@course) }
      else
        format.turbo_stream do
          turbo_stream.append('course-table', partial: 'shared/failed', locals: { message: 'Course destroy failed.', type: 'notice' })
          turbo_stream.update('course-table', partial: 'admin/courses/table', locals: { courses: @courses })
        end
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_course
    @course = Course.find_by(id: params[:id])
  end

  def course_params
    params.require(:course).permit(:id, :course_name, :description, :fees, :course_type)
  end
end
