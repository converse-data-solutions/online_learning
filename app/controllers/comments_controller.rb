class CommentsController < ApplicationController
  before_action :authenticate_user! 

  def new
    @comment = Comment.new
  end
  def create
    @comment = Comment.new(comment_params)
    @comment.user_id = current_user.id 

    if @comment.save
      flash[:notice] = "Comment created successfully"
    else
      flash[:alert] = "You have already commented for this course."   
    end

    redirect_back(fallback_location: root_path)
  end

  def edit
    @course = Course.find(params[:course_id])
    @comment = @course.comments.find(params[:id])
  end

  def update
    @course = Course.find(params[:course_id])
    @comment = @course.comments.find(params[:id])

    if @comment.update(comment_params)
      redirect_to @course, notice: "Comment updated successfully"
    else
      render 'edit'
    end
  end

  def destroy
    @course = Course.find(params[:course_id])
    @comment = @course.comments.find(params[:id])
    @comment.destroy

    redirect_to @course, notice: "Comment deleted successfully"
  end

  private

  def comment_params
    params.require(:comment).permit(:body, :commentable_type, :commentable_id, :user_id)
  end

end
