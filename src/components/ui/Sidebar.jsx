import React from 'react'
import { Phone, HelpCircle, Heart, Stethoscope, Syringe, Pill, LayoutDashboard, User, Cross } from 'lucide-react'

const Sidebar = ({ activeSection, onNavigate }) => {
  const tools = [
    { id: 'doctor', icon: User, label: 'Dr. AI', section: 1, color: '#00ffff' },
    { id: 'analyzer', icon: Stethoscope, label: 'Analyzer', section: 2, color: '#ef4444' },
    { id: 'tracker', icon: Syringe, label: 'Tracker', section: 3, color: '#22c55e' },
    { id: 'medication', icon: Pill, label: 'Medications', section: 4, color: '#f97316' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', section: 5, color: '#a855f7' }
  ]
  
  const scrollToSection = (index) => {
    // index 0 = landing page, index 1-5 = scroll sections
    const sections = document.querySelectorAll('.scroll-section')
    // Landing page is at DOM index 0, tools start at DOM index 1
    const targetIndex = index === 0 ? 0 : index
    if (sections[targetIndex]) {
      sections[targetIndex].scrollIntoView({ behavior: 'smooth' })
    }
    if (onNavigate) onNavigate(index)
  }
  
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 z-30 glass-morphism-dark border-r border-white/5 flex flex-col">
      {/* HEALIX Logo with Medical Theme - At Top */}
      <div className="p-4 border-b border-white/5 group relative cursor-pointer" onClick={() => scrollToSection(0)}>
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-red-500/30 relative">
          <span className="text-2xl font-black text-white">H</span>
          {/* Medical cross overlay */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <Cross size={8} className="text-red-500" />
          </div>
        </div>
        {/* HEALIX Tooltip */}
        <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
          HEALIX
        </div>
      </div>
      
      {/* User Card */}
      <div className="p-4 border-b border-white/5">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-healix-pink to-red-500 flex items-center justify-center mb-2">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="text-center">
          <div className="text-white font-semibold text-xs truncate">Yusuf Jawed</div>
          <div className="flex items-center justify-center gap-1 text-green-400 text-xs">
            <Heart size={12} className="fill-current" />
            <span>75</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-2 px-2">
          {tools.map(tool => {
            const Icon = tool.icon
            return (
              <li key={tool.id}>
                <button
                  onClick={() => scrollToSection(tool.section)}
                  className={`w-full p-3 rounded-xl transition-all duration-300 group relative ${
                    activeSection === tool.section
                      ? 'bg-gradient-to-r from-healix-blue to-healix-purple text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={tool.label}
                >
                  <Icon className="w-6 h-6 block text-center mx-auto" style={{ color: activeSection === tool.section ? tool.color : undefined }} />
                  
                  {/* Tooltip with new label */}
                  <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {tool.label}
                  </div>
                  
                  {/* Active indicator */}
                  {activeSection === tool.section && (
                    <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-healix-cyan rounded-full" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      {/* Emergency & Help */}
      <div className="p-4 border-t border-white/5 space-y-2">
        {/* Emergency SOS Button */}
        <button
          onClick={() => {
            window.open('tel:108', '_self')
          }}
          className="w-full p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl animate-pulse hover:from-red-400 hover:to-red-500 transition-all group relative"
          title="Emergency SOS"
        >
          <div className="flex flex-col items-center">
            <Phone className="w-5 h-5 text-white mb-1" />
            <span className="text-white text-xs font-bold">SOS</span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-red-600 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Call 108 (Ambulance)
          </div>
        </button>
        
        {/* Help Button */}
        <button
          className="w-full p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group relative"
          title="Help & Support"
        >
          <div className="flex flex-col items-center">
            <HelpCircle className="w-5 h-5 mb-1" />
            <span className="text-xs">Help</span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            <div className="mb-1">Chat Support</div>
            <div className="text-gray-400">📞 +91 7903810922</div>
          </div>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
