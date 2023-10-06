class EntrollmentDetailsController < ApplicationController
  def update_progress
    @lesson = Lesson.find(params[:lesson_id])
    @entrollment = current_user.entrollments.find_by(course_id: params[:course_id])

    @entrollment_detail = @entrollment.entrollment_details.find_or_initialize_by(lesson_id: @lesson.id)

    video_percentage = params[:progress].to_f
    @entrollment_detail.update(view_time: video_percentage)

    video_duration = @lesson.clip.metadata['duration'].to_i
    if @entrollment_detail.status != true
      @entrollment_detail.update(status: true) if video_percentage >= 100
    end

    render json: { message: 'Progress updated successfully' }
  end


    def show
        @lesson = Lesson.find(params[:id])
        @entrollment_detail = EntrollmentDetail.find_or_create_by(lesson: @lesson)
        @video_duration = @lesson.clip.metadata['duration'].to_i
        @current_time = @entrollment_detail.view_time.to_i

            if @current_time >= @video_duration
              @video_progress = 100.0
              @entrollment_detail.update(status: true)
            else
              @video_progress = (@current_time.to_f / @video_duration) * 100
            end
    
        render 'entrollment_details/show'
      end

    private

    def entrollment_detail_params
      params.require(:entrollment_detail).permit(:view_time, :lesson_id, :entrollment_id, :status)
    end

end
