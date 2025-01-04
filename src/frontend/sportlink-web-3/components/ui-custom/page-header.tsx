interface PageHeaderProps {
    title: string
    description?: string
    children: React.ReactNode
  }
  
  export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="text-left mb-8">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    )
  }