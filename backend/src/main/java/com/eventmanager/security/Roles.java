package com.eventmanager.security;

public class Roles {
    // Primary Roles
    public static final String STUDENT = "STUDENT";
    public static final String FACULTY = "FACULTY";
    public static final String DIRECTOR = "DIRECTOR";

    // Faculty Sub-Roles
    public static final String FACULTY_MEMBER = "FACULTY_MEMBER";
    public static final String FACULTY_COORDINATOR = "FACULTY_COORDINATOR";
    public static final String CLUB_HEAD = "CLUB_HEAD";

    // Director Sub-Roles
    public static final String HOD = "HOD";
    public static final String COLLEGE_ADMIN = "COLLEGE_ADMIN";
    public static final String AMBASSADOR = "AMBASSADOR";
    public static final String JUDGE = "JUDGE";
    public static final String DEAN_OF_CAMPUS = "DEAN_OF_CAMPUS"; // Keeping for backward compat if needed

    // Spring Security Authorities
    public static final String ROLE_STUDENT = "ROLE_STUDENT";
    public static final String ROLE_FACULTY = "ROLE_FACULTY";
    public static final String ROLE_DIRECTOR = "ROLE_DIRECTOR";

    public static final String ROLE_FACULTY_MEMBER = "ROLE_FACULTY_MEMBER";
    public static final String ROLE_FACULTY_COORDINATOR = "ROLE_FACULTY_COORDINATOR";
    public static final String ROLE_CLUB_HEAD = "ROLE_CLUB_HEAD";

    public static final String ROLE_HOD = "ROLE_HOD";
    public static final String ROLE_COLLEGE_ADMIN = "ROLE_COLLEGE_ADMIN";
    public static final String ROLE_AMBASSADOR = "ROLE_AMBASSADOR";
    public static final String ROLE_JUDGE = "ROLE_JUDGE";
    public static final String ROLE_DEAN_OF_CAMPUS = "ROLE_DEAN_OF_CAMPUS";
}
