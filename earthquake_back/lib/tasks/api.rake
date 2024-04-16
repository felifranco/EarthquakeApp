namespace :api do
  desc "Getting data from earthquake.usgs.gov"
  task fetchData: :environment do

    print "Fetching data..."
    
    earthquakeSite = URI('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
    response = Net::HTTP.get(earthquakeSite)

    data = JSON.parse(response)

    loading = 0;
    nuevos = 0;
    data['features'].each do |item|
      
      properties = item['properties']
      
      unless existe(item['id'])

        unless ( (properties['title']).blank? and
        (properties['url']).blank? and
        (properties['place']).blank? and
        (properties['magType']).blank? )

          geometry = item['geometry']
          coordinates = geometry['coordinates']
          mag = properties['mag']
          longitude = coordinates[0]
          latitude = coordinates[1]

          
          if ( (mag >= -1 and mag <= 10) and
            (latitude >= -90 and latitude <= 90) and
            (longitude >= -180 and longitude <= 180) )

            feature = Feature.new({
              type: item['type'],
              external_id: item['id'],
              magnitude: mag,
              place: properties['place'],
              time: properties['time'],
              tsunami: properties['tsunami'],
              mag_type: properties['magType'],
              title: properties['title'],
              coordinates: {
                longitude: longitude,
                latitude: latitude,
              },
              links: { 
                external_url: properties['url']
              }
            })
            feature.save
            #puts "added: #{item['id']}"
            nuevos += 1
          end
        end
      end
      loading += 1
      if (loading % 100) == 0
        print "."
      end
    end    
    puts " Insertados: #{nuevos}."
  end

  def existe(value)
    Feature.where('external_id' => value).exists?
  end

end
