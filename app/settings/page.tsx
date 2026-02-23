"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Cairo } from "next/font/google"

// @ts-ignore - Import من JavaScript files
import { authAPI, settingsAPI, teamAPI, billingAPI, integrationsAPI, securityAPI, advancedAPI } from "../../shared-api-config/api/endpoints"
// @ts-ignore
import { logout } from "../../shared-api-config/utils/auth"

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "600", "700"] })

type UserRole = "owner" | "admin" | "staff" | "moderator" | "member"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRole
}

type Section =
  | "account"
  | "billing"
  | "workspace"
  | "team"
  | "automation"
  | "integrations"
  | "notifications"
  | "security"
  | "advanced"

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("account")
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<User>({
    id: "1",
    name: "Haider Don",
    email: "haider@triggerio.io",
    role: "owner",
    avatar: "https://i.pravatar.cc/150?img=12",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch current user from API
  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔵 Settings: Fetching current user...")
      const response = await authAPI.getCurrentUser()
      console.log("🟢 Settings: Current user response:", response)

      const userData = response.user || response.data || response
      if (userData) {
        setCurrentUser({
          id: userData._id || userData.id || "1",
          name: userData.name || userData.fullName || `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User",
          email: userData.email || "",
          role: userData.role || "owner",
          avatar: userData.avatar || userData.profileImage || `https://i.pravatar.cc/150?img=12`,
        })
      }
    } catch (err: any) {
      console.error("❌ Settings: Failed to fetch current user:", err)
      setError(err.message || "فشل تحميل بيانات المستخدم")
      // Keep fallback data on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const canViewSection = (section: Section): boolean => {
    const { role } = currentUser

    if (role === "owner") return true

    if (role === "admin") {
      return section !== "billing" && section !== "advanced"
    }

    return ["account", "notifications", "security"].includes(section)
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${cairo.className}`} dir="rtl">
      {/* Fixed Sidebar - Right side for RTL */}
      <div className="w-64 h-screen bg-white border-l border-gray-200 fixed right-0 top-0 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {/* Account - Visible to all */}
          <NavButton
            active={activeSection === "account"}
            onClick={() => setActiveSection("account")}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
            label="حسابي"
          />

          {/* Billing - Owner only */}
          {canViewSection("billing") && (
            <NavButton
              active={activeSection === "billing"}
              onClick={() => setActiveSection("billing")}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              }
              label="الاشتراك والفواتير"
            />
          )}

          {/* Workspace - Owner & Admin */}
          {canViewSection("workspace") && (
            <NavButton
              active={activeSection === "workspace"}
              onClick={() => setActiveSection("workspace")}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              }
              label="إعدادات المساحة"
            />
          )}

          {/* Team - Owner & Admin */}
          {canViewSection("team") && (
            <NavButton
              active={activeSection === "team"}
              onClick={() => setActiveSection("team")}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              }
              label="الفريق والصلاحيات"
              badge="مهم"
            />
          )}

          {/* Automation - Owner & Admin */}
          {canViewSection("automation") && (
            <NavButton
              active={activeSection === "automation"}
              onClick={() => setActiveSection("automation")}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
              label="إعدادات الأتمتة"
            />
          )}

          {/* Integrations - Owner & Admin */}
          {canViewSection("integrations") && (
            <NavButton
              active={activeSection === "integrations"}
              onClick={() => setActiveSection("integrations")}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              }
              label="التكاملات"
            />
          )}

          {/* Notifications - All roles */}
          <NavButton
            active={activeSection === "notifications"}
            onClick={() => setActiveSection("notifications")}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            }
            label="الإشعارات"
          />

          {/* Security - All roles */}
          <NavButton
            active={activeSection === "security"}
            onClick={() => setActiveSection("security")}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
            label="الأمان"
          />

          {/* Advanced - Owner only */}
          {canViewSection("advanced") && (
            <NavButton
              active={activeSection === "advanced"}
              onClick={() => setActiveSection("advanced")}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                </svg>
              }
              label="متقدم"
            />
          )}
        </nav>

        {/* Logout Button - pushed to bottom */}
        <div className="mt-auto border-t border-gray-200 p-4">
          <button
            onClick={() => { authAPI.logout().catch(() => {}); logout(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right text-red-600 hover:bg-red-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-sm font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Main Content - margin-right to avoid sidebar overlap */}
      <div className="mr-64">
        {/* Global Error Banner */}
        {error && (
          <div className="m-8 mb-0 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={fetchCurrentUser}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !error ? (
          <div className="p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded-full w-20"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeSection === "account" && <AccountSection currentUser={currentUser} />}
            {activeSection === "billing" && canViewSection("billing") && <BillingSection />}
            {activeSection === "workspace" && canViewSection("workspace") && <WorkspaceSection />}
            {activeSection === "team" && canViewSection("team") && <TeamSection currentUser={currentUser} />}
            {activeSection === "automation" && canViewSection("automation") && <AutomationSection />}
            {activeSection === "integrations" && canViewSection("integrations") && <IntegrationsSection />}
            {activeSection === "notifications" && <NotificationsSection />}
            {activeSection === "security" && <SecuritySection />}
            {activeSection === "advanced" && canViewSection("advanced") && (
              <AdvancedSection
                onTransferOwnership={() => setShowTransferModal(true)}
                onDeleteWorkspace={() => setShowDeleteModal(true)}
              />
            )}
          </>
        )}
      </div>

      {/* Transfer Ownership Modal */}
      {showTransferModal && <TransferOwnershipModal onClose={() => setShowTransferModal(false)} />}

      {/* Delete Workspace Modal */}
      {showDeleteModal && <DeleteWorkspaceModal onClose={() => setShowDeleteModal(false)} />}
    </div>
  )
}

// Navigation Button Component
function NavButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right ${
        active ? "bg-[#7C3AED]/10 text-[#7C3AED] font-semibold" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span className={active ? "text-[#7C3AED]" : "text-gray-500"}>{icon}</span>
      <div className="flex-1">
        <div className={`text-sm ${active ? "font-semibold" : "font-medium"}`}>{label}</div>
      </div>
      {badge && <span className="px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded text-xs font-medium">{badge}</span>}
    </button>
  )
}

// SECTION 1: Account
function AccountSection({ currentUser }: { currentUser: User }) {
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("+964 770 123 4567")
  const [timezone, setTimezone] = useState("(GMT+3:00) بغداد")
  const [language, setLanguage] = useState("العربية")

  useEffect(() => {
    // Parse name from currentUser
    const nameParts = currentUser.name.split(" ")
    setFirstName(nameParts[0] || "")
    setLastName(nameParts.slice(1).join(" ") || "")
    setEmail(currentUser.email)
  }, [currentUser])

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setSaveMsg(null)
      console.log("🔵 Settings: Saving profile...")
      await settingsAPI.updateProfile({
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
      })
      console.log("🟢 Settings: Profile saved successfully")
      setSaveMsg("تم حفظ التغييرات بنجاح")
      setTimeout(() => setSaveMsg(null), 3000)
    } catch (err: any) {
      console.error("❌ Settings: Failed to save profile:", err)
      setSaveMsg(err.message || "فشل حفظ التغييرات")
    } finally {
      setSaving(false)
    }
  }

  const handleSavePreferences = async () => {
    try {
      setSaving(true)
      setSaveMsg(null)
      console.log("🔵 Settings: Saving preferences...")
      await settingsAPI.updatePreferences({ timezone, language })
      console.log("🟢 Settings: Preferences saved successfully")
      setSaveMsg("تم حفظ التفضيلات بنجاح")
      setTimeout(() => setSaveMsg(null), 3000)
    } catch (err: any) {
      console.error("❌ Settings: Failed to save preferences:", err)
      setSaveMsg(err.message || "فشل حفظ التفضيلات")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">حسابي الشخصي</h2>
        <p className="text-gray-600">إدارة معلوماتك الشخصية وتفضيلاتك</p>
      </div>

      {/* Save Message */}
      {saveMsg && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
          saveMsg.includes("فشل") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          {saveMsg}
        </div>
      )}

      {/* Profile Picture */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">صورة الملف الشخصي</h3>
        <div className="flex items-center gap-6">
          <img
            src={currentUser.avatar || "/placeholder.svg"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
            id="profileImage"
          />
          <div>
            <input
              type="file"
              id="profilePictureInput"
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) {
                  if (!file.type.startsWith("image/")) {
                    alert("الرجاء اختيار صورة فقط (JPG, PNG, GIF)")
                    return
                  }
                  if (file.size > 2 * 1024 * 1024) {
                    alert("حجم الصورة يجب أن يكون أقل من 2 ميجابايت")
                    return
                  }
                  // Show preview immediately
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    const img = document.getElementById("profileImage") as HTMLImageElement
                    if (img && event.target?.result) {
                      img.src = event.target.result as string
                    }
                  }
                  reader.readAsDataURL(file)

                  // Upload to API
                  try {
                    console.log("🔵 Settings: Uploading avatar...")
                    const formData = new FormData()
                    formData.append("avatar", file)
                    await settingsAPI.updateAvatar(formData)
                    console.log("🟢 Settings: Avatar uploaded successfully")
                  } catch (err: any) {
                    console.error("❌ Settings: Failed to upload avatar:", err)
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById("profilePictureInput")?.click()}
              className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#7C3AED]/90 text-sm font-medium mb-2"
            >
              رفع صورة جديدة
            </button>
            <p className="text-xs text-gray-500">JPG, PNG أو GIF. الحد الأقصى 2 ميجابايت</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الشخصية</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">الاسم الأول</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">اسم العائلة</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">البريد الإلكتروني</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] rounded text-xs font-medium">
              ✓ تم التحقق
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">رقم الهاتف</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          />
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#7C3AED]/90 font-medium disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">التفضيلات</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">المنطقة الزمنية</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          >
            <option>(GMT+3:00) بغداد</option>
            <option>(GMT+4:00) دبي</option>
            <option>(GMT+3:00) الرياض</option>
            <option>(GMT+2:00) القاهرة</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">اللغة</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          >
            <option>العربية</option>
            <option>English</option>
            <option>Français</option>
          </select>
        </div>

        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#7C3AED]/90 font-medium disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : "حفظ التفضيلات"}
        </button>
      </div>

      {/* Password */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">كلمة المرور</h3>
        <p className="text-sm text-gray-600 mb-4">آخر تغيير: منذ 30 يوماً</p>
        <button
          onClick={async () => {
            try {
              console.log("🔵 Settings: Requesting password change...")
              await settingsAPI.changePassword({ requestReset: true })
              alert("تم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني")
            } catch (err: any) {
              console.error("❌ Settings: Password change failed:", err)
              alert(err.message || "فشل طلب تغيير كلمة المرور")
            }
          }}
          className="px-6 py-2 border border-[#7C3AED] text-[#7C3AED] rounded-lg hover:bg-[#7C3AED]/10 font-medium"
        >
          تغيير كلمة المرور
        </button>
      </div>
    </div>
  )
}

// SECTION 2: Billing & Subscription
function BillingSection() {
  const [subscription, setSubscription] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        setLoading(true)
        console.log("🔵 Settings: Fetching billing data...")
        const [subRes, invRes] = await Promise.all([
          billingAPI.getSubscription().catch(() => null),
          billingAPI.getInvoices().catch(() => null),
        ])
        console.log("🟢 Settings: Billing data:", { subscription: subRes, invoices: invRes })
        if (subRes) setSubscription(subRes.subscription || subRes.data || subRes)
        if (invRes) setInvoices(invRes.invoices || invRes.data || invRes || [])
      } catch (err: any) {
        console.error("❌ Settings: Failed to fetch billing:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchBilling()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">الاشتراك والفواتير</h2>
        <p className="text-gray-600">إدارة خطة الاشتراك ومعلومات الفواتير</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#7C3AED]/80 rounded-lg p-8 mb-6 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold">{subscription?.planName || "Professional Plan"}</h3>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {subscription?.status || "Active"}
              </span>
            </div>
            <p className="text-purple-100">{subscription?.description || "مثالي لوكالات التسويق المتنامية"}</p>
          </div>
          <div className="text-left">
            <div className="text-3xl font-bold mb-1">${subscription?.price || "299"}</div>
            <div className="text-sm text-purple-100">{subscription?.interval || "سنوياً"}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold mb-1">{subscription?.activeCampaigns || "10"}</div>
            <div className="text-sm text-purple-100">حملات نشطة</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold mb-1">{subscription?.contactsLimit || "5,000"}</div>
            <div className="text-sm text-purple-100">جهات اتصال</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold mb-1">{subscription?.messagesLimit || "30,000"}</div>
            <div className="text-sm text-purple-100">رسالة/شهر</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={async () => {
              try {
                console.log("🔵 Settings: Upgrading plan...")
                await billingAPI.upgradePlan("agency")
                alert("تم طلب الترقية بنجاح")
              } catch (err: any) {
                console.error("❌ Settings: Upgrade failed:", err)
                alert(err.message || "فشل طلب الترقية")
              }
            }}
            className="px-6 py-3 bg-white text-[#7C3AED] rounded-lg hover:bg-purple-50 font-semibold"
          >
            الترقية إلى خطة الوكالة
          </button>
          <button
            onClick={async () => {
              if (!confirm("هل أنت متأكد من إلغاء الاشتراك؟")) return
              try {
                console.log("🔵 Settings: Cancelling subscription...")
                await billingAPI.cancelSubscription()
                alert("تم إلغاء الاشتراك")
              } catch (err: any) {
                console.error("❌ Settings: Cancel failed:", err)
                alert(err.message || "فشل إلغاء الاشتراك")
              }
            }}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 font-semibold"
          >
            إلغاء الاشتراك
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-100">يتجدد في:</span>
            <span className="font-semibold">{subscription?.renewalDate || "15 يناير 2026"}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">طريقة الدفع</h3>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-gradient-to-br from-[#3B82F6] to-[#3B82F6]/80 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
            <div>
              <div className="font-semibold text-gray-900">•••• •••• •••• 1234</div>
              <div className="text-sm text-gray-600">تنتهي 12/2026</div>
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
            تحديث
          </button>
        </div>

        <button className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#7C3AED]/90 font-medium">
          + إضافة طريقة دفع
        </button>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">سجل الفواتير</h3>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">التاريخ</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">الوصف</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">المبلغ</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">الحالة</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">الفاتورة</th>
                </tr>
              </thead>
              <tbody>
                {(invoices.length > 0 ? invoices : [
                  { date: "16 ديسمبر 2024", description: "Professional Plan (سنوي)", amount: "$299.00", status: "مدفوع" },
                  { date: "16 ديسمبر 2023", description: "Starter Plan (سنوي)", amount: "$99.00", status: "مدفوع" },
                ]).map((inv: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-700 text-right">{inv.date}</td>
                    <td className="py-4 px-4 text-sm text-gray-700 text-right">{inv.description}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900 text-right">{inv.amount}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-xs font-medium">
                        {inv.status || "مدفوع"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button className="text-[#7C3AED] hover:text-[#7C3AED]/80 text-sm font-medium">تحميل</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// SECTION 3: Workspace Settings
function WorkspaceSection() {
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [workspaceName, setWorkspaceName] = useState("Triggerio Marketing")

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        console.log("🔵 Settings: Fetching workspace settings...")
        const response = await settingsAPI.getWorkspace()
        console.log("🟢 Settings: Workspace data:", response)
        const data = response.workspace || response.data || response
        if (data?.name) setWorkspaceName(data.name)
      } catch (err: any) {
        console.error("❌ Settings: Failed to fetch workspace:", err)
      }
    }
    fetchWorkspace()
  }, [])

  const handleSaveWorkspace = async () => {
    try {
      setSaving(true)
      setSaveMsg(null)
      console.log("🔵 Settings: Saving workspace...")
      await settingsAPI.updateWorkspace({ name: workspaceName })
      console.log("🟢 Settings: Workspace saved")
      setSaveMsg("تم حفظ التغييرات بنجاح")
      setTimeout(() => setSaveMsg(null), 3000)
    } catch (err: any) {
      console.error("❌ Settings: Failed to save workspace:", err)
      setSaveMsg(err.message || "فشل حفظ التغييرات")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">إعدادات المساحة</h2>
        <p className="text-gray-600">تكوين إعدادات وتفضيلات المساحة</p>
      </div>

      {saveMsg && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
          saveMsg.includes("فشل") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          {saveMsg}
        </div>
      )}

      {/* Workspace Identity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">هوية المساحة</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">اسم المساحة</label>
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">شعار المساحة</label>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center text-[#7C3AED] text-2xl font-bold">
              T
            </div>
            <div>
              <input type="file" id="workspaceLogoInput" accept="image/png,image/svg+xml" className="hidden" />
              <button
                type="button"
                onClick={() => document.getElementById("workspaceLogoInput")?.click()}
                className="px-4 py-2 border border-[#7C3AED] text-[#7C3AED] rounded-lg hover:bg-[#7C3AED]/10 text-sm font-medium mb-2"
              >
                رفع الشعار
              </button>
              <p className="text-xs text-gray-500">PNG أو SVG. الحد الأقصى 1 ميجابايت. الموصى به: 200×200 بكسل</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveWorkspace}
          disabled={saving}
          className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#7C3AED]/90 font-medium disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>

      {/* Regional Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الإعدادات الإقليمية</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              المنطقة الزمنية الافتراضية
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent">
              <option>(GMT+3:00) بغداد</option>
              <option>(GMT+4:00) دبي</option>
              <option>(GMT+3:00) الرياض</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">تنسيق التاريخ</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent">
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">العملة</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent">
            <option>USD ($) - دولار أمريكي</option>
            <option>EUR (€) - يورو</option>
            <option>AED (د.إ) - درهم إماراتي</option>
            <option>IQD (ع.د) - دينار عراقي</option>
          </select>
        </div>

        <button
          onClick={handleSaveWorkspace}
          disabled={saving}
          className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#7C3AED]/90 font-medium disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>

      {/* Working Hours */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ساعات العمل</h3>
        <p className="text-sm text-gray-600 mb-4">حدد ساعات عمل مؤسستك لجدولة الأتمتة</p>

        <div className="space-y-3">
          {["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"].map((day, idx) => (
            <div key={day} className="flex items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={idx < 5}
                  className="w-5 h-5 text-[#7C3AED] border-gray-300 rounded focus:ring-[#7C3AED]"
                />
                <span className="w-24 text-sm font-medium text-gray-700">{day}</span>
              </label>

              <input
                type="time"
                defaultValue="09:00"
                disabled={idx >= 5}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] text-sm disabled:bg-gray-100"
              />

              <span className="text-gray-500">إلى</span>

              <input
                type="time"
                defaultValue="18:00"
                disabled={idx >= 5}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] text-sm disabled:bg-gray-100"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveWorkspace}
          disabled={saving}
          className="mt-6 px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#7C3AED]/90 font-medium disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : "حفظ ساعات العمل"}
        </button>
      </div>
    </div>
  )
}

// SECTION 4: Team & Permissions
function TeamSection({ currentUser }: { currentUser: User }) {
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true)
        console.log("🔵 Settings: Fetching team members...")
        const response = await teamAPI.getMembers()
        console.log("🟢 Settings: Team members:", response)
        const members = response.members || response.data || response || []
        setTeamMembers(Array.isArray(members) ? members : [])
      } catch (err: any) {
        console.error("❌ Settings: Failed to fetch team:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  const roleMap: Record<string, { label: string; icon: string }> = {
    owner: { label: "المالك", icon: "👑" },
    admin: { label: "مدير", icon: "🔧" },
    staff: { label: "موظف", icon: "💼" },
    moderator: { label: "مشرف", icon: "👮" },
    member: { label: "عضو", icon: "👤" },
  }

  // Fallback team data when API hasn't returned results yet
  const displayMembers = teamMembers.length > 0 ? teamMembers : [
    { id: "1", name: currentUser.name, email: currentUser.email, role: "owner", status: "active", avatar: currentUser.avatar, lastActive: "الآن", isSelf: true },
    { id: "2", name: "أحمد علي", email: "ahmad@triggerio.io", role: "admin", status: "active", avatar: "https://i.pravatar.cc/150?img=13", lastActive: "منذ 2 ساعة" },
    { id: "3", name: "سارة محمد", email: "sara@triggerio.io", role: "staff", status: "active", avatar: "https://i.pravatar.cc/150?img=20", lastActive: "منذ 5 ساعات" },
    { id: "4", name: "عمر حسن", email: "omar@triggerio.io", role: "moderator", status: "active", avatar: "https://i.pravatar.cc/150?img=33", lastActive: "منذ يوم" },
    { id: "5", name: "فاطمة حسن", email: "fatima@example.com", role: "member", status: "pending", avatar: "https://i.pravatar.cc/150?img=45", lastActive: "-" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">الفريق والصلاحيات</h2>
        <p className="text-gray-600">إدارة أعضاء الفريق وصلاحيات الوصول</p>
      </div>

      {/* Your Role Card */}
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#7C3AED]/80 rounded-lg p-6 mb-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">دورك: {roleMap[currentUser.role]?.label || "المالك"}</h3>
              <p className="text-purple-100 text-sm">Your Role: {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-purple-100 mb-4">
          بصفتك مالك المساحة، لديك تحكم كامل في جميع الإعدادات وإدارة الفريق والفواتير ويمكنك نقل أو حذف المساحة.
        </p>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-sm text-purple-100 mb-1">✓ جميع الإعدادات</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-sm text-purple-100 mb-1">✓ إدارة الفريق</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-sm text-purple-100 mb-1">✓ الوصول للفواتير</div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">أعضاء الفريق ({displayMembers.length})</h3>
          <button
            onClick={async () => {
              const email = prompt("أدخل البريد الإلكتروني للعضو الجديد:")
              if (!email) return
              try {
                console.log("🔵 Settings: Inviting team member:", email)
                await teamAPI.inviteMember({ email, role: "member" })
                alert("تم إرسال الدعوة بنجاح")
              } catch (err: any) {
                console.error("❌ Settings: Failed to invite:", err)
                alert(err.message || "فشل إرسال الدعوة")
              }
            }}
            className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#7C3AED]/90 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            إضافة عضو
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">العضو</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">البريد الإلكتروني</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">الدور</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">الحالة</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">آخر نشاط</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {displayMembers.map((member: any) => {
                  const isSelf = member.isSelf || member.id === currentUser.id || member.email === currentUser.email
                  const role = roleMap[member.role] || { label: member.role, icon: "👤" }
                  const isPending = member.status === "pending"
                  return (
                    <tr key={member.id || member.email} className={`border-b border-gray-100 ${isSelf ? "bg-[#7C3AED]/5" : ""}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img src={member.avatar || "/placeholder.svg"} className="w-10 h-10 rounded-full" alt="User" />
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{member.name}</div>
                            {isSelf && <div className="text-xs text-gray-500">(أنت)</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 text-right">{member.email}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          member.role === "owner" ? "bg-[#7C3AED]/10 text-[#7C3AED]" : "bg-gray-100 text-gray-700"
                        }`}>
                          <span>{role.icon}</span> {role.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isPending ? "bg-[#F59E0B]/10 text-[#F59E0B]" : "bg-[#10B981]/10 text-[#10B981]"
                        }`}>
                          {isPending ? "قيد الانتظار" : "نشط"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 text-center">{member.lastActive || "-"}</td>
                      <td className="py-4 px-4 text-center">
                        {isSelf ? (
                          <span className="text-sm text-gray-400">-</span>
                        ) : isPending ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  console.log("🔵 Settings: Resending invite to:", member.email)
                                  await teamAPI.resendInvite(member.id)
                                  alert("تم إعادة إرسال الدعوة")
                                } catch (err: any) {
                                  alert(err.message || "فشل إعادة الإرسال")
                                }
                              }}
                              className="px-3 py-1 border border-[#7C3AED] text-[#7C3AED] rounded-lg hover:bg-[#7C3AED]/10 text-xs font-medium"
                            >
                              إعادة إرسال
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  console.log("🔵 Settings: Cancelling invite for:", member.email)
                                  await teamAPI.cancelInvite(member.id)
                                  alert("تم إلغاء الدعوة")
                                } catch (err: any) {
                                  alert(err.message || "فشل إلغاء الدعوة")
                                }
                              }}
                              className="px-3 py-1 border border-[#EF4444] text-[#EF4444] rounded-lg hover:bg-[#EF4444]/10 text-xs font-medium"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs font-medium">
                            تحرير
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الأدوار والصلاحيات</h3>
        <p className="text-sm text-gray-600 mb-6">فهم ما يمكن لكل دور فعله في مساحة العمل</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-semibold text-gray-900">الصلاحية</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">
                  <div className="flex flex-col items-center gap-1">
                    <span>👑</span>
                    <span>المالك</span>
                  </div>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">
                  <div className="flex flex-col items-center gap-1">
                    <span>🔧</span>
                    <span>مدير</span>
                  </div>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">
                  <div className="flex flex-col items-center gap-1">
                    <span>💼</span>
                    <span>موظف</span>
                  </div>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">
                  <div className="flex flex-col items-center gap-1">
                    <span>👮</span>
                    <span>مشرف</span>
                  </div>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">
                  <div className="flex flex-col items-center gap-1">
                    <span>👤</span>
                    <span>عضو</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                <td colSpan={6} className="py-2 px-4 font-semibold text-gray-700 text-right">
                  الحملات
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700 text-right">عرض جميع الحملات</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700 text-right">إنشاء حملات</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700 text-right">حذف جميع الحملات</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
              </tr>

              <tr className="bg-gray-50">
                <td colSpan={6} className="py-2 px-4 font-semibold text-gray-700 text-right">
                  الفريق والإعدادات
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700 text-right">إدارة الفريق</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓*</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700 text-right">عرض الفواتير</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700 text-right">حذف المساحة</td>
                <td className="py-3 px-4 text-center text-[#10B981] font-semibold">✓</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
                <td className="py-3 px-4 text-center text-gray-300">✗</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg">
          <p className="text-sm text-[#F59E0B]">
            <strong>* ملاحظة:</strong> يمكن للمدير إدارة أعضاء الفريق باستثناء المالك والمديرين الآخرين
          </p>
        </div>
      </div>
    </div>
  )
}

// SECTION 5: Automation
function AutomationSection() {
  const [saving, setSaving] = useState(false)
  const [autoReply, setAutoReply] = useState(true)
  const [autoTag, setAutoTag] = useState(true)
  const [autoReplyMsg, setAutoReplyMsg] = useState("شكراً لتواصلك معنا! نحن حالياً خارج ساعات العمل، ولكن سنرد على رسالتك في أقرب وقت ممكن.")

  useEffect(() => {
    const fetchAutomation = async () => {
      try {
        console.log("🔵 Settings: Fetching automation settings...")
        const response = await settingsAPI.getAutomation()
        console.log("🟢 Settings: Automation data:", response)
        const data = response.automation || response.data || response
        if (data) {
          if (typeof data.autoReply === "boolean") setAutoReply(data.autoReply)
          if (typeof data.autoTag === "boolean") setAutoTag(data.autoTag)
          if (data.autoReplyMessage) setAutoReplyMsg(data.autoReplyMessage)
        }
      } catch (err: any) {
        console.error("❌ Settings: Failed to fetch automation:", err)
      }
    }
    fetchAutomation()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      console.log("🔵 Settings: Saving automation settings...")
      await settingsAPI.updateAutomation({ autoReply, autoTag, autoReplyMessage: autoReplyMsg })
      console.log("🟢 Settings: Automation saved")
      alert("تم حفظ الإعدادات بنجاح")
    } catch (err: any) {
      console.error("❌ Settings: Failed to save automation:", err)
      alert(err.message || "فشل حفظ الإعدادات")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">إعدادات الأتمتة</h2>
        <p className="text-gray-600">تكوين قواعد الأتمتة والردود التلقائية</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">الرد التلقائي</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoReply}
              onChange={(e) => setAutoReply(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7C3AED]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
          </label>
        </div>
        <p className="text-sm text-gray-600 mb-4">إرسال رد تلقائي عندما يتواصل العملاء خارج ساعات العمل</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">رسالة الرد التلقائي</label>
          <textarea
            rows={4}
            value={autoReplyMsg}
            onChange={(e) => setAutoReplyMsg(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#7C3AED]/90 font-medium disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">الوسم التلقائي</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoTag}
              onChange={(e) => setAutoTag(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7C3AED]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
          </label>
        </div>
        <p className="text-sm text-gray-600">إضافة وسوم تلقائياً بناءً على محتوى الرسالة أو مصدرها</p>
      </div>
    </div>
  )
}

// SECTION 6: Integrations
const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    iconBg: "bg-gradient-to-br from-[#E4405F] via-[#F77737] to-[#FCAF45]",
    description: "أتمتة التعليقات والرسائل على Instagram",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "📘",
    iconBg: "bg-[#1877F2]",
    description: "أتمتة المنشورات والتعليقات على Facebook",
  },
  {
    id: "brevo",
    name: "Brevo",
    icon: "📧",
    iconBg: "bg-[#3B82F6]",
    description: "إرسال حملات البريد الإلكتروني",
  },
  {
    id: "gohighlevel",
    name: "GoHighLevel",
    icon: "⚡",
    iconBg: "bg-[#10B981]",
    description: "مزامنة جهات الاتصال وإدارة CRM",
  },
]

function IntegrationsSection() {
  const [apiIntegrations, setApiIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [settingsModal, setSettingsModal] = useState<{ open: boolean; integration: any; settings: any; loading: boolean }>({ open: false, integration: null, settings: null, loading: false })

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true)
        console.log("🔵 Settings: Fetching integrations...")
        const response = await integrationsAPI.getAll()
        console.log("🟢 Settings: Integrations:", response)
        const data = response.integrations || response.data || response || []
        setApiIntegrations(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error("❌ Settings: Failed to fetch integrations:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchIntegrations()
  }, [])

  // Merge static platform definitions with API data
  const mergedPlatforms = PLATFORMS.map((platform) => {
    const apiData = apiIntegrations.find((i: any) => i.id === platform.id || i.name?.toLowerCase() === platform.name.toLowerCase())
    const isConnected = apiData ? (apiData.connected || apiData.status === "connected") : false
    return {
      ...platform,
      connected: isConnected,
      accountName: apiData?.accountName || apiData?.pageName || apiData?.account_name || null,
      lastSync: apiData?.lastSync || null,
    }
  })

  const handleConnect = async (platformId: string) => {
    try {
      console.log("🔵 Settings: Connecting integration:", platformId)
      await integrationsAPI.connect(platformId, {})
      // Refresh integrations list
      const response = await integrationsAPI.getAll()
      const data = response.integrations || response.data || response || []
      setApiIntegrations(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error("❌ Settings: Failed to connect:", err)
      alert(err.message || "فشل الربط")
    }
  }

  const handleDisconnect = async (platform: any) => {
    if (confirm(`هل تريد فصل ${platform.name}؟`)) {
      try {
        console.log("🔵 Settings: Disconnecting:", platform.id)
        await integrationsAPI.disconnect(platform.id)
        setApiIntegrations(prev => prev.filter((i: any) => i.id !== platform.id))
      } catch (err: any) {
        console.error("❌ Settings: Failed to disconnect:", err)
        alert(err.message || "فشل فصل التكامل")
      }
    }
  }

  const handleOpenSettings = async (platform: any) => {
    setSettingsModal({ open: true, integration: platform, settings: null, loading: true })
    try {
      console.log("🔵 Settings: Fetching settings for:", platform.id)
      const response = await integrationsAPI.getSettings(platform.id)
      console.log("🟢 Settings: Got settings:", response)
      setSettingsModal(prev => ({ ...prev, settings: response.settings || response.data || response, loading: false }))
    } catch (err: any) {
      console.error("❌ Settings: Failed to fetch settings:", err)
      setSettingsModal(prev => ({ ...prev, settings: {}, loading: false }))
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">التكاملات</h2>
        <p className="text-gray-600">ربط حسابك مع المنصات والخدمات الأخرى</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mergedPlatforms.map((platform) => (
            <div
              key={platform.id}
              className={`bg-white rounded-xl border ${platform.connected ? "border-[#10B981]/30" : "border-gray-200"} p-6 transition-shadow hover:shadow-md`}
            >
              {/* Platform Header */}
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-14 h-14 ${platform.iconBg} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                  <span className="text-3xl">{platform.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900 text-lg">{platform.name}</h4>
                    {platform.connected && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#10B981]/10 text-[#10B981] rounded-full text-xs font-semibold">
                        <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></span>
                        متصل
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{platform.description}</p>
                </div>
              </div>

              {/* Connected Account Info */}
              {platform.connected && platform.accountName && (
                <div className="mb-4 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="text-gray-400 ml-1">الحساب:</span>
                    <span className="font-medium text-gray-800">{platform.accountName}</span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {platform.connected ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenSettings(platform)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors"
                  >
                    إعدادات
                  </button>
                  <button
                    onClick={() => handleDisconnect(platform)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors"
                  >
                    إدارة
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(platform.id)}
                  className="w-full px-4 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] text-sm font-semibold transition-colors"
                >
                  ربط الحساب
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Settings Modal */}
      {settingsModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSettingsModal({ open: false, integration: null, settings: null, loading: false })}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${settingsModal.integration?.iconBg || "bg-gray-100"} rounded-lg flex items-center justify-center`}>
                  <span className="text-xl">{settingsModal.integration?.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">إعدادات {settingsModal.integration?.name}</h3>
              </div>
              <button onClick={() => setSettingsModal({ open: false, integration: null, settings: null, loading: false })} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>

            {settingsModal.loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
                    <span className="text-sm text-gray-600">متصل ويعمل بشكل طبيعي</span>
                  </div>
                </div>
                {settingsModal.integration?.accountName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الحساب المتصل</label>
                    <p className="text-sm text-gray-600">{settingsModal.integration.accountName}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">آخر مزامنة</label>
                  <p className="text-sm text-gray-600">{settingsModal.integration?.lastSync || "غير متوفر"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المزامنة التلقائية</label>
                  <p className="text-sm text-gray-600">مفعّلة - كل 15 دقيقة</p>
                </div>
                <div className="pt-4 border-t border-gray-200 flex gap-2">
                  <button
                    onClick={() => setSettingsModal({ open: false, integration: null, settings: null, loading: false })}
                    className="flex-1 px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] text-sm font-medium"
                  >
                    إغلاق
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`هل تريد فصل ${settingsModal.integration?.name}؟`)) {
                        try {
                          await integrationsAPI.disconnect(settingsModal.integration?.id)
                          setApiIntegrations(prev => prev.filter((i: any) => i.id !== settingsModal.integration?.id))
                          setSettingsModal({ open: false, integration: null, settings: null, loading: false })
                        } catch (err: any) {
                          alert(err.message || "فشل فصل التكامل")
                        }
                      }
                    }}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
                  >
                    فصل التكامل
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// SECTION 7: Notifications
function NotificationsSection() {
  const [saving, setSaving] = useState(false)
  const [newCampaigns, setNewCampaigns] = useState(true)
  const [newLeads, setNewLeads] = useState(true)
  const [billingUpdates, setBillingUpdates] = useState(true)
  const [browserNotifs, setBrowserNotifs] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("🔵 Settings: Fetching notification preferences...")
        const response = await settingsAPI.getNotifications()
        console.log("🟢 Settings: Notifications data:", response)
        const data = response.notifications || response.data || response
        if (data) {
          if (typeof data.newCampaigns === "boolean") setNewCampaigns(data.newCampaigns)
          if (typeof data.newLeads === "boolean") setNewLeads(data.newLeads)
          if (typeof data.billingUpdates === "boolean") setBillingUpdates(data.billingUpdates)
          if (typeof data.browserNotifications === "boolean") setBrowserNotifs(data.browserNotifications)
        }
      } catch (err: any) {
        console.error("❌ Settings: Failed to fetch notifications:", err)
      }
    }
    fetchNotifications()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      console.log("🔵 Settings: Saving notification preferences...")
      await settingsAPI.updateNotifications({
        newCampaigns,
        newLeads,
        billingUpdates,
        browserNotifications: browserNotifs,
      })
      console.log("🟢 Settings: Notifications saved")
      alert("تم حفظ الإعدادات بنجاح")
    } catch (err: any) {
      console.error("❌ Settings: Failed to save notifications:", err)
      alert(err.message || "فشل حفظ الإعدادات")
    } finally {
      setSaving(false)
    }
  }

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => { onChange(e.target.checked); handleSave() }}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7C3AED]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
    </label>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">الإشعارات</h2>
        <p className="text-gray-600">إدارة تفضيلات الإشعارات</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">إشعارات البريد الإلكتروني</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-gray-900">حملات جديدة</div>
              <div className="text-sm text-gray-600">عندما يتم إنشاء حملة جديدة</div>
            </div>
            <Toggle checked={newCampaigns} onChange={setNewCampaigns} />
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <div className="font-medium text-gray-900">عملاء محتملون جدد</div>
              <div className="text-sm text-gray-600">عندما يتم استلام عميل محتمل جديد</div>
            </div>
            <Toggle checked={newLeads} onChange={setNewLeads} />
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <div className="font-medium text-gray-900">تحديثات الفواتير</div>
              <div className="text-sm text-gray-600">إشعارات بشأن الفواتير والمدفوعات</div>
            </div>
            <Toggle checked={billingUpdates} onChange={setBillingUpdates} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">إشعارات المتصفح</h3>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-medium text-gray-900">تفعيل إشعارات المتصفح</div>
            <div className="text-sm text-gray-600">تلقي إشعارات في الوقت الفعلي على المتصفح</div>
          </div>
          <Toggle checked={browserNotifs} onChange={setBrowserNotifs} />
        </div>
      </div>
    </div>
  )
}

// SECTION 8: Security
function SecuritySection() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSecurity = async () => {
      try {
        setLoading(true)
        console.log("🔵 Settings: Fetching security data...")
        const response = await securityAPI.getSessions()
        console.log("🟢 Settings: Sessions:", response)
        const data = response.sessions || response.data || response || []
        setSessions(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error("❌ Settings: Failed to fetch sessions:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSecurity()
  }, [])

  const displaySessions = sessions.length > 0 ? sessions : [
    { id: "1", device: "Chrome on macOS", location: "Baghdad, Iraq", isCurrent: true, lastActive: "نشط الآن", icon: "💻" },
    { id: "2", device: "Safari on iPhone", location: "Dubai, UAE", isCurrent: false, lastActive: "منذ 2 يوم", icon: "📱" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">الأمان</h2>
        <p className="text-gray-600">إدارة إعدادات الأمان والخصوصية</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">المصادقة الثنائية</h3>
        <p className="text-sm text-gray-600 mb-4">أضف طبقة إضافية من الأمان إلى حسابك</p>

        <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg mb-4">
          <p className="text-sm text-[#F59E0B] font-medium">⚠️ المصادقة الثنائية غير مفعلة</p>
        </div>

        <button
          onClick={async () => {
            try {
              console.log("🔵 Settings: Enabling 2FA...")
              await securityAPI.enable2FA()
              alert("تم تفعيل المصادقة الثنائية")
            } catch (err: any) {
              console.error("❌ Settings: 2FA enable failed:", err)
              alert(err.message || "فشل تفعيل المصادقة الثنائية")
            }
          }}
          className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#7C3AED]/90 font-medium"
        >
          تفعيل المصادقة الثنائية
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الجلسات النشطة</h3>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {displaySessions.map((session: any) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${session.isCurrent ? "bg-[#10B981]/10" : "bg-gray-200"} rounded-lg flex items-center justify-center`}>
                    <span className="text-xl">{session.icon || "💻"}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{session.device}</div>
                    <div className="text-sm text-gray-600">{session.location} {session.isCurrent ? "• الجلسة الحالية" : ""}</div>
                  </div>
                </div>
                {session.isCurrent ? (
                  <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-xs font-medium">نشط الآن</span>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        console.log("🔵 Settings: Revoking session:", session.id)
                        await securityAPI.revokeSession(session.id)
                        setSessions((prev) => prev.filter((s: any) => s.id !== session.id))
                        alert("تم إنهاء الجلسة")
                      } catch (err: any) {
                        console.error("❌ Settings: Failed to revoke session:", err)
                        alert(err.message || "فشل إنهاء الجلسة")
                      }
                    }}
                    className="px-3 py-1 border border-[#EF4444] text-[#EF4444] rounded-lg hover:bg-[#EF4444]/10 text-sm font-medium"
                  >
                    إنهاء
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">مفاتيح API</h3>
        <p className="text-sm text-gray-600 mb-4">إدارة مفاتيح API للتكامل مع الأنظمة الخارجية</p>
        <button
          onClick={async () => {
            const name = prompt("أدخل اسم مفتاح API:")
            if (!name) return
            try {
              console.log("🔵 Settings: Creating API key:", name)
              const response = await securityAPI.createAPIKey({ name })
              alert(`تم إنشاء مفتاح API: ${response.key || response.apiKey || "تم بنجاح"}`)
            } catch (err: any) {
              console.error("❌ Settings: Failed to create API key:", err)
              alert(err.message || "فشل إنشاء مفتاح API")
            }
          }}
          className="px-6 py-2 border border-[#7C3AED] text-[#7C3AED] rounded-lg hover:bg-[#7C3AED]/10 font-medium"
        >
          إنشاء مفتاح API جديد
        </button>
      </div>
    </div>
  )
}

// SECTION 9: Advanced
function AdvancedSection({
  onTransferOwnership,
  onDeleteWorkspace,
}: {
  onTransferOwnership: () => void
  onDeleteWorkspace: () => void
}) {
  const [activityLog, setActivityLog] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true)
        console.log("🔵 Settings: Fetching activity log...")
        const response = await advancedAPI.getActivityLog({ limit: 10 })
        console.log("🟢 Settings: Activity log:", response)
        const data = response.activities || response.data || response || []
        setActivityLog(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error("❌ Settings: Failed to fetch activity log:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchActivity()
  }, [])

  const displayActivities = activityLog.length > 0 ? activityLog : [
    { id: "1", title: "تمت الترقية إلى خطة Professional", description: "السابق: Starter ($99/سنة) ← الجديد: Professional ($299/سنة)", time: "منذ ساعتين", type: "danger", icon: "🚨" },
    { id: "2", title: "أحمد أضاف سارة (موظف) إلى الفريق", description: "البريد الإلكتروني: sara@triggerio.io", time: "منذ 5 ساعات", type: "warning", icon: "👥" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">الإعدادات المتقدمة</h2>
        <p className="text-gray-600">إعدادات المطورين والخيارات المتقدمة</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">سجل الأنشطة</h3>
        <p className="text-sm text-gray-600 mb-4">عرض جميع الأنشطة المهمة في المساحة</p>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {displayActivities.map((activity: any) => {
              const bgColor = activity.type === "danger" ? "bg-[#EF4444]/10 border-[#EF4444]/20" : "bg-[#F59E0B]/10 border-[#F59E0B]/20"
              const iconBg = activity.type === "danger" ? "bg-[#EF4444]/10" : "bg-[#F59E0B]/10"
              return (
                <div key={activity.id} className={`flex items-start gap-4 p-4 ${bgColor} border rounded-lg`}>
                  <div className={`flex-shrink-0 w-10 h-10 ${iconBg} rounded-full flex items-center justify-center`}>
                    <span className="text-xl">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
          عرض السجل الكامل
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">نقل ملكية المساحة</h3>
        <p className="text-sm text-gray-600 mb-4">نقل ملكية المساحة بالكامل إلى عضو آخر في الفريق</p>

        <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg mb-4">
          <p className="text-sm text-[#F59E0B]">⚠️ تحذير: هذا الإجراء دائم ولا يمكن التراجع عنه</p>
        </div>

        <button
          onClick={onTransferOwnership}
          className="px-6 py-2 border border-[#F59E0B] text-[#F59E0B] rounded-lg hover:bg-[#F59E0B]/10 font-medium"
        >
          نقل الملكية
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#EF4444]/5 border-2 border-[#EF4444]/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#EF4444] mb-2">⚠️ منطقة الخطر</h3>
        <p className="text-sm text-gray-700 mb-4">الإجراءات هنا دائمة ولا يمكن التراجع عنها. يرجى التصرف بحذر.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white border border-[#EF4444]/30 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">حذف المساحة</h4>
              <p className="text-sm text-gray-600">حذف المساحة بشكل دائم وجميع البيانات المرتبطة بها</p>
            </div>
            <button
              onClick={onDeleteWorkspace}
              className="px-6 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#EF4444]/90 font-medium whitespace-nowrap"
            >
              حذف المساحة
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Transfer Ownership Modal
function TransferOwnershipModal({ onClose }: { onClose: () => void }) {
  const [selectedMember, setSelectedMember] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">⚠️ نقل الملكية</h2>
        </div>

        <div className="p-6">
          <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg mb-6">
            <p className="text-sm text-[#EF4444] font-medium mb-2">⚠️ تحذير: هذا الإجراء دائم ولا يمكن التراجع عنه.</p>
            <p className="text-sm text-[#EF4444]">
              سيكون للمالك الجديد تحكم كامل في المساحة، بما في ذلك الفواتير والقدرة على إزالتك من الفريق.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">المالك الجديد</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="">اختر عضو من الفريق...</option>
              <option value="ahmad">🔧 أحمد (مدير)</option>
              <option value="sara">💼 سارة (موظف)</option>
              <option value="omar">👮 عمر (مشرف)</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">أدخل &quot;TRANSFER&quot; للتأكيد</label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="TRANSFER"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              إلغاء
            </button>
            <button
              disabled={confirmText !== "TRANSFER" || !selectedMember || submitting}
              onClick={async () => {
                try {
                  setSubmitting(true)
                  console.log("🔵 Settings: Transferring ownership to:", selectedMember)
                  await advancedAPI.transferOwnership({ newOwnerId: selectedMember, confirmation: confirmText })
                  alert("تم نقل الملكية بنجاح")
                  onClose()
                } catch (err: any) {
                  console.error("❌ Settings: Transfer failed:", err)
                  alert(err.message || "فشل نقل الملكية")
                } finally {
                  setSubmitting(false)
                }
              }}
              className="flex-1 px-6 py-3 bg-[#EF4444] text-white rounded-lg hover:bg-[#EF4444]/90 font-medium disabled:opacity-50"
            >
              {submitting ? "جاري النقل..." : "نقل الملكية"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Delete Workspace Modal
function DeleteWorkspaceModal({ onClose }: { onClose: () => void }) {
  const [confirmText, setConfirmText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#EF4444]">⚠️ حذف المساحة</h2>
        </div>

        <div className="p-6">
          <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg mb-6">
            <p className="text-sm text-[#EF4444] font-medium mb-2">⚠️ هذا الإجراء دائم ولا يمكن التراجع عنه!</p>
            <p className="text-sm text-[#EF4444]">سيتم حذف جميع البيانات بشكل دائم بما في ذلك:</p>
            <ul className="text-sm text-[#EF4444] mt-2 mr-6 list-disc">
              <li>جميع الحملات والرسائل</li>
              <li>جميع جهات الاتصال</li>
              <li>جميع التكاملات</li>
              <li>جميع أعضاء الفريق</li>
            </ul>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              أدخل اسم المساحة &quot;Triggerio Marketing&quot; للتأكيد
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Triggerio Marketing"
              className="w-full px-4 py-2 border border-[#EF4444]/50 rounded-lg focus:ring-2 focus:ring-[#EF4444]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              إلغاء
            </button>
            <button
              disabled={confirmText !== "Triggerio Marketing" || submitting}
              onClick={async () => {
                try {
                  setSubmitting(true)
                  console.log("🔵 Settings: Deleting workspace...")
                  await advancedAPI.deleteWorkspace({ confirmation: confirmText })
                  alert("تم حذف المساحة")
                  onClose()
                } catch (err: any) {
                  console.error("❌ Settings: Delete failed:", err)
                  alert(err.message || "فشل حذف المساحة")
                } finally {
                  setSubmitting(false)
                }
              }}
              className="flex-1 px-6 py-3 bg-[#EF4444] text-white rounded-lg hover:bg-[#EF4444]/90 font-medium disabled:opacity-50"
            >
              {submitting ? "جاري الحذف..." : "حذف المساحة نهائياً"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
