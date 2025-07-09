import React from 'react'

interface DetectionStatsProps {
  detections: [string, any][]
  isProcessing: boolean
}

const DetectionStats: React.FC<DetectionStatsProps> = ({ detections, isProcessing }) => {
  // Count detections by class
  const detectionCounts = detections.reduce((acc, [className]) => {
    acc[className] = (acc[className] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalDetections = detections.length
  const uniqueClasses = Object.keys(detectionCounts).length

  return (
    <div style={{
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '20px',
      borderRadius: '10px',
      marginTop: '20px',
      minWidth: '300px',
      maxWidth: '640px',
      color: 'white'
    }}>
      <h3 style={{ 
        margin: '0 0 15px 0', 
        color: '#4CAF50',
        fontSize: '1.2rem',
        textAlign: 'center'
      }}>
        Detection Statistics
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          padding: '10px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>
            {totalDetections}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Total Objects</div>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          padding: '10px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2196F3' }}>
            {uniqueClasses}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Unique Classes</div>
        </div>
      </div>

      {isProcessing && (
        <div style={{
          textAlign: 'center',
          color: '#FFC107',
          marginBottom: '15px',
          fontSize: '0.9rem'
        }}>
          🔄 Processing...
        </div>
      )}

      {totalDetections > 0 && (
        <div>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            color: '#FFC107',
            fontSize: '1rem'
          }}>
            Detected Objects:
          </h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {Object.entries(detectionCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([className, count]) => (
                <div key={className} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  margin: '4px 0',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ 
                    textTransform: 'capitalize',
                    fontWeight: '500'
                  }}>
                    {className}
                  </span>
                  <span style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {totalDetections === 0 && !isProcessing && (
        <div style={{
          textAlign: 'center',
          color: '#888',
          fontStyle: 'italic',
          padding: '20px'
        }}>
          No objects detected
        </div>
      )}
    </div>
  )
}

export default DetectionStats