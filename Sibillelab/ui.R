library(shinydashboard)
library(leaflet)
library(shinycssloaders)

header <- dashboardHeader(
  title = "Sibille Lab"
)

Sidebar<-dashboardSidebar(
  sidebarMenu(
    uiOutput("organism"),
    uiOutput("data") ,
    uiOutput("gene"),
    actionButton("do", "Submit")
    
    ),
  p("Note: This form is reactive! Please allow few seconds for Gene Names to load.")
  
    
  )


body <- dashboardBody(
  fluidRow(
    
    column(width=12,
           box(width = NULL, solidHeader = TRUE,p(
             class = "text-muted",
             paste("") 
           ),
           withSpinner(htmlOutput("gene_name"))
           )
    ),
    
    column(width = 6,
           box(width = NULL, solidHeader = TRUE,p(
             class = "text-muted",
             paste("Gene Information:") 
           ),
           withSpinner(htmlOutput("Gene_Info", width = 500))
           
           )
           
    ),
    
    column(width = 6,
           box(width = NULL, solidHeader = TRUE,p(
             class = "text-muted",
             paste("Statistical Details:") 
           ),
           withSpinner(DT::dataTableOutput("details", width = 500))
           
           )
           
    ),
    
    column(width = 6,
     box(width = NULL, solidHeader = TRUE,p(
        class = "text-muted",
        paste("Scatter Plot:") 
      ),
      withSpinner(plotOutput("graph",height = 500))
      )
     ),
    
    column(width = 6,
      box(width = NULL,p(
        class = "text-muted",
        paste("Scatter Plot Data:")
      ),
      withSpinner(DT::dataTableOutput("dbtable", width = 500)),
        tags$br(),
        downloadLink('downloadData', 'Download')
      )
    ),
    
    
    column(width=12,
           box(width = NULL, solidHeader = TRUE,p(
             class = "text-muted",
             paste("Forest Plot:") 
           ),
           withSpinner(plotOutput("forestplot"))
           )
    )
    
    
    
  )
)


dashboardPage(
  header,
  Sidebar,
  body,
  skin = "purple"
)
