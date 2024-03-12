class CreateEnquires < ActiveRecord::Migration[7.0]
  def change
    create_table :enquires do |t|
      t.string :name
      t.string :course
      t.bigint :contact
      t.string :location
      t.string :timeslot
      t.bigint :no_of_people
      t.integer :status
      t.datetime :follow_up
      t.text :remarks
      t.string :sales_person
      t.string :references
      t.string :lead_source

      t.timestamps
    end
  end
end
