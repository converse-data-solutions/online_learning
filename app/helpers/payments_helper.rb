module PaymentsHelper
  def pdf_stylesheet_link_tag(src, options = {})
    if params[:debug] == 'true'
      stylesheet_link_tag(src, options)
    else
      wicked_pdf_stylesheet_link_tag(src, options)
    end
  end
end
