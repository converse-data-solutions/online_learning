class RatingsController < ApplicationController
  before_action :find_course

  def create
    @rating = @course.ratings.new(rating_params)
    @rating.user = current_user 
    if @rating.save
      redirect_to @course, notice: 'Rating was successfully created.'
    else
      # Handle validation errors or other errors here
      redirect_to @course, alert: "You have already rated for this course."
    end
  end

  private

  def find_course
    @course = Course.find(params[:course_id])
  end

  def rating_params
    params.require(:rating).permit(:star)
  end
end
