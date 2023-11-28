# frozen_string_literal: true

# This is an Admin Course controller
class Admin::CoursesController < ApplicationController
  # before_action :authenticate_admin!
  require 'will_paginate/array'
  def index
    @courses = []
    Course.all.each do |course|
      @courses.push(course)
    end
    @courses = @courses.paginate(page: params[:page], per_page: 5)
    @sections = Course.last.sections
    @lessons = Lesson.all
  end

  def new
    @course = Course.new
  end

  def create
    @course = Course.new(course_params)
    nil if @course.save
  end

  def edit
    @course = Course.find(params[:id])
  end

  def update
    @course = Course.find(params[:id])
    if @course.update(course_params)
      redirect_to admin_courses_path
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @course = Course.find(params[:id])
    return unless @course.destroy

    redirect_to admin_courses_path
  end

  def show
    @course = Course.find(params[:id])
  end

  private

  def course_params
    params.require(:course).permit(:id, :course_name, :description)
  end
end
