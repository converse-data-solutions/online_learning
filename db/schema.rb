# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_03_22_062340) do
  create_table "active_storage_attachments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "attendances", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.datetime "class_date"
    t.boolean "status", default: true
    t.bigint "user_course_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_course_id"], name: "index_attendances_on_user_course_id"
  end

  create_table "batch_students", id: false, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "batch_id", null: false
    t.bigint "user_id", null: false
    t.index ["batch_id", "user_id"], name: "index_batch_students_on_batch_id_and_user_id", unique: true
    t.index ["batch_id"], name: "index_batch_students_on_batch_id"
    t.index ["user_id"], name: "index_batch_students_on_user_id"
  end

  create_table "batch_timings", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "day"
    t.time "from_time"
    t.time "to_time"
    t.bigint "batch_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["batch_id"], name: "index_batch_timings_on_batch_id"
  end

  create_table "batches", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "batch_name"
    t.date "effective_from"
    t.date "effective_to"
    t.bigint "course_id", null: false
    t.bigint "primary_trainer_id", null: false
    t.bigint "secondary_trainer_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "index_batches_on_course_id"
    t.index ["primary_trainer_id"], name: "index_batches_on_primary_trainer_id"
    t.index ["secondary_trainer_id"], name: "index_batches_on_secondary_trainer_id"
  end

  create_table "comments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.text "body"
    t.string "commentable_type", null: false
    t.bigint "commentable_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["commentable_type", "commentable_id"], name: "index_comments_on_commentable"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "courses", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "course_name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "fees", precision: 10
    t.integer "course_type", default: 0
  end

  create_table "enquires", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.string "course_name"
    t.bigint "contact"
    t.string "location"
    t.string "timeslot"
    t.bigint "no_of_people"
    t.integer "status"
    t.datetime "follow_up"
    t.text "remarks"
    t.string "sales_person"
    t.string "references"
    t.string "lead_source"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "entrollment_details", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.float "view_time"
    t.boolean "status"
    t.bigint "entrollment_id", null: false
    t.bigint "lesson_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["entrollment_id"], name: "index_entrollment_details_on_entrollment_id"
    t.index ["lesson_id"], name: "index_entrollment_details_on_lesson_id"
  end

  create_table "entrollments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "status"
    t.bigint "user_id", null: false
    t.bigint "course_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "index_entrollments_on_course_id"
    t.index ["user_id"], name: "index_entrollments_on_user_id"
  end

  create_table "lessons", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.bigint "section_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["section_id"], name: "index_lessons_on_section_id"
  end

  create_table "payments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.datetime "paid_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "paid_amount", precision: 10
    t.bigint "user_course_id"
    t.index ["user_course_id"], name: "fk_rails_daaae70391"
  end

  create_table "profiles", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "alternate_phone"
    t.string "office_email"
    t.string "higher_education"
    t.integer "idcard_type"
    t.string "idcard_no"
    t.bigint "user_id", null: false
    t.string "additional_info"
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "ratings", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.float "star"
    t.string "rateable_type", null: false
    t.bigint "rateable_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["rateable_type", "rateable_id"], name: "index_ratings_on_rateable"
    t.index ["user_id"], name: "index_ratings_on_user_id"
  end

  create_table "roles", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["name"], name: "index_roles_on_name"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource"
  end

  create_table "sections", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "title"
    t.bigint "course_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "description"
    t.index ["course_id"], name: "index_sections_on_course_id"
  end

  create_table "subscription_details", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "subscription_id", null: false
    t.string "stripe_subscription_id"
    t.integer "amount"
    t.datetime "paid_at"
    t.datetime "start_date"
    t.datetime "end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["subscription_id"], name: "index_subscription_details_on_subscription_id"
    t.index ["user_id"], name: "index_subscription_details_on_user_id"
  end

  create_table "subscriptions", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.datetime "paid_until"
    t.string "stripe_customer_ref"
    t.string "stripe_subscription_ref"
    t.datetime "next_invoice_on"
    t.bigint "user_id", null: false
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_subscriptions_on_user_id"
  end

  create_table "trainer_attendances", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "trainer_course_id", null: false
    t.date "attendance_date"
    t.string "class_timing"
    t.boolean "status", default: true
    t.bigint "batch_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["batch_id"], name: "index_trainer_attendances_on_batch_id"
    t.index ["trainer_course_id"], name: "index_trainer_attendances_on_trainer_course_id"
  end

  create_table "trainer_courses", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "course_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "index_trainer_courses_on_course_id"
    t.index ["user_id"], name: "index_trainer_courses_on_user_id"
  end

  create_table "user_courses", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "course_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "enrolled_at"
    t.decimal "course_amount", precision: 10
    t.datetime "next_payment_date"
    t.index ["course_id"], name: "index_user_courses_on_course_id"
    t.index ["user_id"], name: "index_user_courses_on_user_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.boolean "deleted", default: false
    t.string "uid"
    t.string "provider"
    t.integer "current_type", default: 0
    t.string "name"
    t.date "dataofbirth"
    t.string "emergency_contact_name"
    t.bigint "emergency_contact_number"
    t.string "gender"
    t.bigint "contact_number"
    t.string "addresses"
    t.string "education"
    t.string "occupation"
    t.string "type"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "users_roles", id: false, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "attendances", "user_courses"
  add_foreign_key "batch_students", "batches"
  add_foreign_key "batch_students", "users"
  add_foreign_key "batch_timings", "batches"
  add_foreign_key "batches", "courses"
  add_foreign_key "batches", "users", column: "primary_trainer_id"
  add_foreign_key "batches", "users", column: "secondary_trainer_id"
  add_foreign_key "comments", "users"
  add_foreign_key "entrollment_details", "entrollments"
  add_foreign_key "entrollment_details", "lessons"
  add_foreign_key "entrollments", "courses"
  add_foreign_key "entrollments", "users"
  add_foreign_key "lessons", "sections"
  add_foreign_key "payments", "user_courses"
  add_foreign_key "profiles", "users"
  add_foreign_key "ratings", "users"
  add_foreign_key "sections", "courses"
  add_foreign_key "subscription_details", "subscriptions"
  add_foreign_key "subscription_details", "users"
  add_foreign_key "subscriptions", "users"
  add_foreign_key "trainer_attendances", "batches"
  add_foreign_key "trainer_attendances", "trainer_courses"
  add_foreign_key "trainer_courses", "courses"
  add_foreign_key "trainer_courses", "users"
  add_foreign_key "user_courses", "courses"
  add_foreign_key "user_courses", "users"
end
