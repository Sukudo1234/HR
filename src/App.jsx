import React from "react";
import Login from "./Login";
import { EmployeeView, AdminView } from "./components/views";
import AddTaskModal from "./components/modals/AddTaskModal";
import EditTaskModal from "./components/modals/EditTaskModal";
import AddGoalModal from "./components/modals/AddGoalModal";
import AddAchievementModal from "./components/modals/AddAchievementModal";
import AddCelebrationModal from "./components/modals/AddCelebrationModal";
import AddHolidayModal from "./components/modals/AddHolidayModal";
import AddOfficeModal from "./components/modals/AddOfficeModal";
import AddJobModal from "./components/modals/AddJobModal";
import AddProjectModal from "./components/modals/AddProjectModal";
import AddEmployeeModal from "./components/modals/AddEmployeeModal";
import AddDocumentModal from "./components/modals/AddDocumentModal";
import AddAnnouncementModal from "./components/modals/AddAnnouncementModal";
import AddEODModal from "./components/modals/AddEODModal";
import LeaveRequestModal from "./components/modals/LeaveRequestModal";
import NotificationsModal from "./components/modals/NotificationsModal";
import ChatModal from "./components/modals/ChatModal";
import NewConversationModal from "./components/modals/NewConversationModal";
import { DEPARTMENTS } from "./utils/constants";
import { useAppLogic } from "./hooks/useAppLogic";

const App = () => {
  const {
    // State
    currentUser,
    employees,
    attendanceRecords,
    leaveRequests,
    tasks,
    announcements,
    holidays,
    eods,
    documents,
    notifications,
    view,
    currentTime,
    adminTab,
    offices,
    modal,
    notifOpen,
    jobs,
    celebrations,
    goals,
    achievements,
    chatOpen,
    conversations,
    messages,
    selectedConvId,
    showNewChat,
    chatDraft,
    editTaskId,
    projects,
    // Setters
    setModal,
    setAdminTab,
    setNotifOpen,
    setShowNewChat,
    setChatDraft,
    setEditTaskId,
    // Actions
    login,
    logout,
    checkIn,
    checkOut,
    submitLeave,
    cancelLeave,
    decideLeave,
    uploadDocument,
    toggleShareDoc,
    deleteDoc,
    addTask,
    updateTask,
    deleteTask,
    startEditTask,
    saveEditedTask,
    addEmployee,
    changeEmpOffice,
    changeEmpRole,
    changeReportingManager,
    toggleEmpActive,
    resetPassword,
    addOffice,
    addJob,
    toggleJob,
    deleteJob,
    addProject,
    updateProject,
    addAnnouncement,
    addHoliday,
    addEOD,
    addCelebration,
    addGoal,
    addAchievement,
    setEmpDate,
    wishEmp,
    openChat,
    closeChat,
    createConversation,
    selectConv,
    sendMessage,
    openNotifs,
    markAllRead,
    clearAllNotifs,
    // Computed
    assignableEmployees,
    currentUserLeaveBalance,
    myNotifs
  } = useAppLogic();

  return (
    <>
      {view === "login" && <Login onLogin={login} />}
      {view === "employee" && currentUser && (
        <EmployeeView
          currentUser={currentUser}
          currentTime={currentTime}
          attendanceRecords={attendanceRecords}
          leaveRequests={leaveRequests}
          tasks={tasks}
          announcements={announcements}
          holidays={holidays}
          eods={eods}
          documents={documents}
          leaveBalance={currentUserLeaveBalance}
          onCheckIn={checkIn}
          onCheckOut={checkOut}
          onOpenLeaveModal={() => setModal("leave")}
          onUpdateTaskStatus={updateTask}
          onAddEOD={() => setModal("add-eod")}
          onLogout={logout}
          onCancelLeave={cancelLeave}
          notifications={notifications}
          openNotifs={openNotifs}
          openChat={openChat}
          goals={goals}
          achievements={achievements}
          onOpenGoal={() => setModal("add-goal")}
          onOpenAch={() => setModal("add-ach")}
          jobs={jobs}
        />
      )}
      {view === "admin" && currentUser && (
        <AdminView
          currentUser={currentUser}
          employees={employees}
          attendanceRecords={attendanceRecords}
          leaveRequests={leaveRequests}
          offices={offices}
          tasks={tasks}
          announcements={announcements}
          holidays={holidays}
          eods={eods}
          documents={documents}
          onOpenAddEmpModal={() => setModal("add-emp")}
          onOpenAddTaskModal={() => setModal("add-task")}
          onOpenAddAnnouncementModal={() => setModal("add-ann")}
          onOpenAddHolidayModal={() => setModal("add-holiday")}
          onOpenAddOfficeModal={() => setModal("add-office")}
          onOpenAddDocModal={() => setModal("add-doc")}
          onAddEmployee={addEmployee}
          onLogout={logout}
          onLeaveApproval={decideLeave}
          onUpdateTaskStatus={updateTask}
          onChangeEmployeeOffice={changeEmpOffice}
          onChangeEmployeeRole={changeEmpRole}
          onChangeReportingManager={changeReportingManager}
          onToggleEmployeeActive={toggleEmpActive}
          onResetPassword={resetPassword}
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          notifications={notifications}
          openNotifs={openNotifs}
          onToggleShareDoc={toggleShareDoc}
          onDeleteDoc={deleteDoc}
          openChat={openChat}
          jobs={jobs}
          onAddJob={() => setModal("add-job")}
          onToggleJob={toggleJob}
          onDeleteJob={deleteJob}
          currentTime={currentTime}
          onCheckIn={checkIn}
          onCheckOut={checkOut}
          onEditTask={startEditTask}
          onDeleteTask={deleteTask}
          celebrations={celebrations}
          onOpenAddCelebration={() => setModal("add-celeb")}
          onOpenLeaveModal={() => setModal("leave")}
          onAddEOD={() => setModal("add-eod")}
          onCancelLeave={cancelLeave}
          goals={goals}
          achievements={achievements}
          onOpenGoal={() => setModal("add-goal")}
          onOpenAch={() => setModal("add-ach")}
          onSetEmpDate={setEmpDate}
          onWish={wishEmp}
          projects={projects}
          onAddProject={() => setModal("add-project")}
          onUpdateProject={updateProject}
        />
      )}

      {/* Modals */}
      {modal === "leave" && (
        <LeaveRequestModal onClose={() => setModal(null)} onSubmit={submitLeave} />
      )}
      {modal === "add-emp" && (
        <AddEmployeeModal
          onClose={() => setModal(null)}
          onSubmit={addEmployee}
          offices={offices}
        />
      )}
      {modal === "add-task" && (
        <AddTaskModal
          onClose={() => setModal(null)}
          onSubmit={addTask}
          employees={assignableEmployees}
        />
      )}
      {modal === "add-ann" && (
        <AddAnnouncementModal onClose={() => setModal(null)} onSubmit={addAnnouncement} />
      )}
      {modal === "add-holiday" && (
        <AddHolidayModal onClose={() => setModal(null)} onSubmit={addHoliday} />
      )}
      {modal === "add-office" && (
        <AddOfficeModal onClose={() => setModal(null)} onSubmit={addOffice} />
      )}
      {modal === "add-eod" && (
        <AddEODModal onClose={() => setModal(null)} onSubmit={addEOD} />
      )}
      {modal === "add-doc" && (
        <AddDocumentModal
          onClose={() => setModal(null)}
          onSubmit={uploadDocument}
          employees={employees.filter(e => e.role === "employee")}
        />
      )}
      {modal === "add-job" && (
        <AddJobModal
          onClose={() => setModal(null)}
          onSubmit={addJob}
          departments={DEPARTMENTS}
        />
      )}
      {modal === "add-project" && (
        <AddProjectModal onClose={() => setModal(null)} onSubmit={addProject} />
      )}
      {modal === "edit-task" && (
        <EditTaskModal
          onClose={() => {
            setModal(null);
            setEditTaskId(null);
          }}
          onSubmit={saveEditedTask}
          task={tasks.find(t => t.id === editTaskId)}
          employees={assignableEmployees}
        />
      )}
      {modal === "add-celeb" && (
        <AddCelebrationModal onClose={() => setModal(null)} onSubmit={addCelebration} />
      )}
      {modal === "add-goal" && (
        <AddGoalModal onClose={() => setModal(null)} onSubmit={addGoal} />
      )}
      {modal === "add-ach" && (
        <AddAchievementModal onClose={() => setModal(null)} onSubmit={addAchievement} />
      )}

      {chatOpen && currentUser && (
        <ChatModal
          onClose={() => {
            closeChat();
            setChatDraft("");
          }}
          conversations={conversations}
          messages={messages}
          employees={employees}
          currentUser={currentUser}
          onSend={sendMessage}
          openNewChat={() => setShowNewChat(true)}
          selectConv={selectConv}
          selectedConvId={selectedConvId}
          draft={chatDraft}
        />
      )}
      {showNewChat && currentUser && (
        <NewConversationModal
          onClose={() => setShowNewChat(false)}
          onCreate={createConversation}
          employees={employees}
          currentUser={currentUser}
        />
      )}

      {notifOpen && (
        <NotificationsModal
          list={myNotifs}
          onClose={() => setNotifOpen(false)}
          markAll={markAllRead}
          clearAll={clearAllNotifs}
        />
      )}
    </>
  );
};

App.displayName = "App";

export default App;
