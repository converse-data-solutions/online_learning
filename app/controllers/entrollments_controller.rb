class EntrollmentsController < ApplicationController
    def new
        @entrollment = Entrollment.new 
        @course = Course.find(params[:course_id])
        @entrollment.course_id = @course.id 
        @entrollment.user_id = current_user.id 
      end
    
      def create
        @entrollment = Entrollment.new(entrollment_params)
    
        if @entrollment.save
          flash[:success] = 'Enrollment request submitted.'
          redirect_to courses_path
        else
          flash[:error] = 'Enrollment request not submitted.'
          render 'new'
        end
      end
      private
    
      def entrollment_params
        params.require(:entrollment).permit(:course_id, :user_id, :status)
      end
end
