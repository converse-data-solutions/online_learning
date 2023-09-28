class RenameVideosToLessons < ActiveRecord::Migration[7.0]
  def change
    rename_table :videos, :lessons
  end
end
