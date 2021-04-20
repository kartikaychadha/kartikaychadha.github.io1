module CsvToJson
  EXPORT_JSON = true
  EXPORT_YML = true

  class Generator < Jekyll::Generator
    def save(site, filename, json)
      #save as json
      path = File.join(site.source, '_data', "#{filename}.json")
      File.write(path, json)
      puts(" export csv to _data/#{filename}.json")
    end

    def pretty_print(json)
      obj = JSON.parse(json)
      JSON.pretty_unparse(obj)
    end

  end
end
  