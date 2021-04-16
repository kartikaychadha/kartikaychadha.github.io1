

 module CsvToJson
  require 'csv'
  require 'json'
  require 'yaml'
  require 'time'

  class Generator < Jekyll::Generator

    safe true
    priority :high

    # initialize config data
    def initialize(config = {})
      # no-op for default
      @csv_dir = "_csv"
      @data = Hash[]
      @done = false
    end

    def generate(site)

      if @done
        return
      end

      base = File.join(site.source, @csv_dir )
      return unless File.directory?(base) && (!site.safe || !File.symlink?(base))

      #movement files
      movement_files = Dir.chdir(base) { Dir['movements/*.csv'] }
      movement_files.delete_if { |e| File.directory?(File.join(base, e)) }

      #place files
      place_files = Dir.chdir(base) { Dir['places/*.csv'] }
      place_files.delete_if { |e| File.directory?(File.join(base, e)) }

      # generate author
      generate_author(site, movement_files)
      # generate countries
      generate_countries(site, place_files, movement_files)

      ## movement_files
      # movement_files.each do |entry|
      #   # path = File.join(site.source, dir, entry)
      #   # next if File.symlink?(path) && site.safe
      #
      #
      # end
      # generate_author(movement_files)

      place_files = Dir.chdir(base) { Dir['places/*.csv'] }
      place_files.delete_if { |e| File.directory?(File.join(base, e)) }

      place_files.each do |entry|
        path = File.join(site.source, @csv_dir, entry)
        next if File.symlink?(path) && site.safe

        # key = sanitize_filename(File.basename(entry, '.*')).
        file_data = CSV.read(path, :headers => true)

        data = Hash.new
        # data['content'] = file_data.to_a[1..-1]
        # data['content_hash'] = file_data.map(&:to_hash)
        # data['keys'] = file_data.headers
        # data['rows'] = data['content'].size
        # data['cols'] = file_data.headers.size

        # csv_data = Hash.new
        # csv_data[key] = data

      end

      @done = true
      # raise ("csv to json export done")
    end

    private
    def pretty_print(json)
      obj = JSON.parse(json)
      JSON.pretty_unparse(obj)
    end

    private
    def save(filename, json)
      #save as json
      path = File.join(site.source, '_data', "#{filename}.json")
      File.write(path, json)
      puts(" Generate _data/countries.json")
    end

    def formate_to_number(string)

      if string.include? "."
        splite_s = string.split('.', 2)
        
        splite_s[0] = Integer(splite_s[0])
        # splite_s[1] = Integer(".#{splite_s[1]}")

        puts(splite_s[1])
        
        # string = splite_s[0] + splite_s[1]

        return string
      end

      return Integer(string)
    end
  end
end

 # Generate _data/Author.json file
 module CsvToJson
   class Generator < Jekyll::Generator
     def generate_author(site, movement_files)
       data = Hash.new
       movement_files.each do |entry|
         path = File.join(site.source, @csv_dir, entry)
         next if File.symlink?(path) && site.safe
         #csv file data csv
         file_data = CSV.read(path, :headers => true)
         #author_values
         data[ file_data.headers[1].gsub(' ', '') ] = entry.gsub('movements/', '').gsub(' - MAIN.csv', '')
       end

       path = File.join(site.source, '_data', 'author.json')
       File.write(path, pretty_print(data.sort.to_h.to_json))
       puts(" csv to json file:._data/author.json")

     end
   end
 end

 # generate _data/countries.json
 module CsvToJson
   class Generator < Jekyll::Generator
    def generate_countries(site, place_files, movement_files)

     data = Hash.new()
     data['type'] = "FeatureCollection"
     data['features'] =[]

     place_files.each do |entry, index|
       path = File.join(site.source, @csv_dir, entry)
       next if File.symlink?(path) && site.safe
       # key = sanitize_filename(File.basename(entry, '.*')).
       table = CSV.read(path, :headers => true)

       index = 0
       table.to_a[1..-1].each do | row|

         row.each do | col |
           data['features'][index]= {
             "type"=> "Feature",
             "id"=> index +1.to_i,
             "geometry"=> {
               "type"=> "Point",
               "coordinates"=> [
                 table[index]['Long'].to_f,
                 table[index]['Lat'].to_f,
               ]
              },
             "properties"=> {
               "type"=> "Sovereign country",
               "country"=> table[index]['Country'].to_s,
               "city"=> table[index]['City'].to_s,
               "region"=> table[index]['Region'].to_s,
               "placeName"=> table[index]['PlaceName'].to_s,
               "popupContent" => "done ",
               "underConstruction": false
             }
           }
         end
         index+=1
       end
     end

     path = File.join(site.source, '_data', 'countries.json')
     File.write(path, pretty_print(data.to_h.to_json))
     puts(" csv to json file:./_data/countries.json")

    end

   end
 end

 # frozen_string_literal: true
 module CsvToJson
   VERSION = '1.0.0'
 end