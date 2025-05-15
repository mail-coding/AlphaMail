package com.alphamail.api.assistants.infrastructure.entity;

import com.alphamail.api.email.infrastructure.entity.EmailEntity;
import com.alphamail.api.user.infrastructure.entity.UserEntity;
import com.alphamail.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "temporary_schedule")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class TemporaryScheduleEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title", length = 255)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email_id")  // 이 부분 수정 필요
    private EmailEntity emailEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "name", length = 20)
    private String name;

    @Column(name = "description", length = 50)
    private String description;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;


}
