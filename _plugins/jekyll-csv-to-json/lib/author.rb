
module CsvToJson

  class Generator < Jekyll::Generator

    safe true
    priority :high

    # initialize config data
    def initialize(config = {})
      # no-op for default
      @csv_dir = "_csv"

    end

    def generate(site)

      base = File.join(site.source, @csv_dir )
      return unless File.directory?(base) && (!site.safe || !File.symlink?(base))

      #movement files
      movement_files = Dir.chdir(base) { Dir['movements/*.csv'] }
      movement_files.delete_if { |e| File.directory?(File.join(base, e)) }

      #place files
      place_files = Dir.chdir(base) { Dir['places/*.csv'] }
      place_files.delete_if { |e| File.directory?(File.join(base, e)) }

      # generate author
      generate_author(site, place_files)


    end

    # Generate author.json
    def generate_author(site, movement_files)
      author_values = Hash.new

      movement_files.each do |entry|
        path = File.join(site.source, @csv_dir, entry)
        next if File.symlink?(path) && site.safe

        #csv file data csv
        file_data = CSV.read(path, :headers => true)

        #author_values
        author_values[ file_data.headers[1].gsub(' ', '') ] = entry.gsub('movements/', '').gsub(' - MAIN.csv', '')
      end

      path = File.join(site.source, '_data', 'author.json')
      File.write(path, pretty_print(author_values.sort.to_h.to_json))
      # raise "Generate _data/author.json"
      puts("Generate _data/author.json")
    end

    private
    def pretty_print(json)
      obj = JSON.parse(json)
      JSON.pretty_unparse(obj)
    end

  end
end

