package com.alphamail.api.email.infrastructure.repository;

import java.util.List;
import java.util.Optional;

import javax.swing.text.html.Option;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.domain.entity.EmailStatus;
import com.alphamail.api.email.infrastructure.entity.EmailEntity;
import com.alphamail.api.email.presentation.dto.EmailThreadItem;
import com.alphamail.api.user.infrastructure.entity.UserEntity;
import io.lettuce.core.Value;

public interface EmailJpaRepository extends JpaRepository<EmailEntity, Integer> {

	Page<EmailEntity> findByFolder_EmailFolderIdAndUser_UserId(Integer folderId, Integer userId, Pageable pageable);

	Integer countByFolder_EmailFolderIdAndUser_UserId(Integer folderId, Integer userId);

	Integer countByFolder_EmailFolderIdAndUser_UserIdAndReadStatusTrue(Integer folderId, Integer userId);

	Page<EmailEntity> findByFolder_EmailFolderIdAndUser_UserIdAndSubjectContaining(
		Integer folderId, Integer userId, String query, Pageable pageable);

	List<EmailEntity> user(UserEntity user);

	Optional<EmailEntity> findByEmailIdAndUser_UserId(Integer emailId, Integer userId);

	@Modifying(clearAutomatically = true)
	@Query("UPDATE EmailEntity e SET "
		+ "e.originalFolderId = CASE WHEN e.originalFolderId IS NULL THEN e.folder.emailFolderId "
		+ "ELSE e.originalFolderId END, "
		+ "e.folder.emailFolderId = :folderId "
		+ "WHERE e.emailId IN :emailIds")
	void updateFolderByEmailIds(@Param("emailIds") List<Integer> emailIds, @Param("folderId") Integer folderId);

	long countByEmailIdInAndUser_UserId(List<Integer> emailIds, Integer userId);

	Boolean existsByEmailIdAndUser_UserId(Integer emailId, Integer userId);

	@Query("""
		    SELECT DISTINCT e FROM EmailEntity e
		    LEFT JOIN FETCH e.attachments
		    WHERE e.folder.emailFolderId = :folderId AND e.user.userId = :userId
		""")
	List<EmailEntity> findAllWithAttachmentsByFolderIdAndUserId(@Param("folderId") Integer folderId,
		@Param("userId") Integer userId);

	List<EmailEntity> findByThreadIdAndUserUserIdOrderByReceivedDateTimeAsc(String threadId, Integer userId);

	@Modifying(clearAutomatically = true)
	@Query("UPDATE EmailEntity e SET e.sesMessageId = :sesMessageId "
		+ "WHERE e.emailId = :emailId")
	void updateSesMessageId(Integer emailId, String sesMessageId);

	@Modifying(clearAutomatically = true)
	@Query("UPDATE EmailEntity e "
		+ "SET e.messageId = :messageId, e.threadId = :threadId, e.emailStatus = :status "
		+ "WHERE e.emailId = :emailId")
	void updateMessageIdThreadIdAndStatus(@Param("emailId") Integer emailId,
		@Param("messageId") String messageId,
		@Param("threadId") String threadId,
		@Param("status") EmailStatus status);

	@Modifying(clearAutomatically = true)
	@Query("UPDATE EmailEntity e SET e.threadId = :threadId WHERE e.emailId = :emailId")
	void updateThreadId(@Param("emailId") Integer emailId, @Param("threadId") String threadId);

	Optional<EmailEntity> findByMessageId(String messageId);

	@Modifying
	@Query("UPDATE EmailEntity e SET e.readStatus = :readStatus WHERE e.emailId = :emailId")
	void updateReadStatusById(@Param("emailId") Integer emailId, @Param("readStatus") Boolean readStatus);

}
