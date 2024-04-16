class Feature
  include Mongoid::Document
  #include Mongoid::Timestamps
  #include Mongoid::Attributes::Dynamic

  field :id, type: String
  field :type, type: String
  field :external_id, type: String
  field :magnitude, type: Float
  field :place, type: String
  field :time, type: String
  field :tsunami, type: Boolean
  field :mag_type, type: String
  field :title, type: String
  field :coordinates, type: Object
  field :links, type: Object

  def as_json(options = {})
    {
      id: self.id,
      type: self.type,
      attributes: {
        external_id: self.external_id,
        magnitude: self.magnitude,
        place: self.place,
        time: self.time,
        tsunami: self.tsunami,
        mag_type: self.mag_type,
        title: self.title,
        coordinates: self.coordinates
      },
      links: self.links
    }
  end
end