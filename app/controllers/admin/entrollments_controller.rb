class Admin::EntrollmentsController < ApplicationController
    before_action :check_admin_role
    before_action :set_entrollment, only: [:edit, :update, :destroy, :show]


    def index
        @entrollments = Entrollment.all
        Rails.logger.debug(@entrollments.inspect)
      end
    
      def edit
        @entrollment = Entrollment.find(params[:id])
      end
      def update
        @entrollment = Entrollment.find(params[:id])
        
        if @entrollment.update(entrollment_params)
          flash[:success] = 'Enrollment status updated.'
          redirect_to admin_entrollments_path
        else
          flash[:error] = 'Failed to update enrollment status.'
          Rails.logger.debug(@entrollment.errors.full_messages) # Log any validation errors
          redirect_back(fallback_location: edit_admin_entrollment_path(@entrollment))
        end
      end
      
    
        def destroy
            @entrollment = Entrollment.find(params[:id])
            if @entrollment.destroy
              flash[:success] = 'Entrollment deleted.'
            else
              flash[:error] = 'Failed to delete entrollment.'
            end
            redirect_to admin_entrollments_path
          end
      def show
        @entrollment = Entrollment.find(params[:id])

      end
    
      private
    
      def set_entrollment
        @entrollment = Entrollment.find(params[:id])
      end
    
      def entrollment_params
        params.require(:entrollment).permit(:status, :course_id, :user_id)
      end
end
