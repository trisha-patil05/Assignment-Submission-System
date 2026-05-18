# Assignment Submission System

A full-stack web application for managing assignments between mentors and students. The project uses React on the frontend and Node.js/Express with MongoDB on the backend, with protected routes for mentor and student roles.[1]

## Implemented Features

### Authentication and access control
- User registration is implemented with name, email, password, and role, and passwords are hashed before saving.[2]
- User login is implemented and returns an authentication token after validating credentials.[2]
- Role-based protected routes are configured for mentor and student pages.[1]
- A reset password route is present in the frontend routing configuration.[1]

### User profile
- Profile update functionality is implemented through an authenticated backend route for updating user name and profile image.[3]

### Mentor features
- Mentors can access a dedicated dashboard through a protected route.[1]
- Mentors can create assignments from a separate create-assignment page and are redirected back to the mentor dashboard after creation.[4]

### Student features
- Students can access a dedicated dashboard through a protected route.[1]
- Students can open a submit-assignment page using a route with assignment id parameters.[1]
- Students can write answer content and upload a file while submitting an assignment.[5]
- The submission form supports drag-and-drop file upload for documents, images, and videos.[5]
- The student dashboard includes assignment listing, grades view, and profile-related sections in the interface.[6]

### Assignment submission workflow
- Submission logic checks whether the assignment exists before saving a submission.[7]
- Submission logic blocks submissions after the deadline has passed.[7][5]
- Submission logic supports file handling for document, image, and video uploads.[7]
- Submitted assignments are stored with content, notes, files, and submission status.[7]
- Students are redirected back to the student dashboard after successful submission.[5]

### Submission review and retrieval
- Backend logic includes fetching submissions for mentors and students with populated assignment and student details.[7]
- A submission history handler is present in the backend controller.[7]

### Notifications and email
- Mentor notification emission is implemented when a student submits an assignment.[7]
- Email sending logic is integrated in the submission controller.[7]

### Frontend routes implemented
- `/login` for login.[1]
- `/register` for registration.[1]
- `/mentor` for mentor dashboard.[1]
- `/mentor/create` for assignment creation.[1]
- `/student` for student dashboard.[1]
- `/student/submit/:id` for assignment submission.[1]
- `/reset-password/:token` for password reset.[1]

## Tech Stack
- Frontend: React, React Router.[1]
- Backend: Node.js, Express.
- Database: MongoDB.
- Authentication: JWT-based auth with bcrypt password hashing.[2]

## Current Project Scope
- Two roles are implemented: mentor and student.[1]
- Core flows implemented so far include authentication, role-based routing, assignment creation, assignment submission, submission retrieval, and dashboard-based access for both user roles.[7][4][6]
