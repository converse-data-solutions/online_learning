class CreateEnquires < ActiveRecord::Migration[7.0]
  def change
    create_table :enquires do |t|
      t.string :name
      t.string :course
      t.integer :contact
      t.string :location
      t.datetime :timeslot
      t.integer :no_of_people
      t.integer :status
      t.date :follow_up
      t.text :remarks
      t.string :sales_person
      t.string :references
      t.string :lead_source

      t.timestamps
    end
  end
end
