class LessonsController < ApplicationController

    def index
        @section = Section.find(params[:section_id])
        @lessons = @section.lessons
    end

    def show
        @lesson = Lesson.find(params[:id])
        @sections = Lesson.where(section_id: @lesson.section_id)
        @comments = @lesson.comments
        @comment = Comment.new
      end
      
end
