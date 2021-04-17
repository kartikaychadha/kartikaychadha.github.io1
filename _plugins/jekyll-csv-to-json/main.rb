module CsvToJson
  require 'csv'
  require 'json'
  require 'yaml'
  require 'time'

  class Generator < Jekyll::Generator

    safe true
    priority :high
    VERSION = '1.0.0'

    # initialize config data
    def initialize(config = {})
      # no-op for default
      @csv_dir = "_csv"
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
      # generate_author(site, movement_files)
      # generate countries
      generate_countries(site, place_files, movement_files)
      # generate countries
      # generate_intersections(site, movement_files)

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
    end

    def getDate (date)
      date = date.to_s
      if date.size == 6 || date.size == 7
          date= "#{date}-01"
      elsif date.size == 4
          date= "#{date}-01-01"
      end
      
      begin
          Date.parse(date)
          rescue ArgumentError
          return Date.new(1950,1,1)
      end
    end
  end
end
